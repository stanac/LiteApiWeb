---
Author: stanac
CreatedDate: 2017-04-15
Title: Custom parameter provider
RenderTitle: false
IsHtml: false
Id: custom-parameter-provider
ParentPageId: parameter-retrieving
---

# Custom parameter provider

If support for additional parameter types from query is needed, developer can 
implement `LiteApi.Contracts.Abstractions.IQueryModelBinder` or inherit 
`LiteApi.Services.ModelBinders.BasicQueryModelBinder` and override 
appropriate methods. After custom query binder is implement it needs to be
registered with `LiteApiOptions` when registering the middleware.
When declaring parameters supported by custom binder, they need to have
`FromQuery` attribute declared (as in the controller at the end of the page).

In sample below we will implement custom query binder for `Stack<T>`.

First we need to implement custom binder by inheriting `BasicQueryModelBinder`.

## Creating custom binder

Easiest way to implement custom binder is to inherit `BasicQueryModelBinder`.
`BasicQueryModelBinder` already knows how to parse simple types and nullable simple
types.

In `BasicQueryModelBinder` we need to override methods `DoesSupportType`
and `ParseParameterValue`. Parameter names should be case insensitive that's why
we use `queryKey` variable.

```csharp
public class StackQueryBinder: BasicQueryModelBinder
{
    public override bool DoesSupportType(Type type)
    {
        var info = type.GetTypeInfo();
        return 
            info.IsGenericType 
            && info.GetGenericTypeDefinition() == typeof(Stack<>)
            && base.DoesSupportType(info.GetGenericArguments()[0]);
    }

    public override object ParseParameterValue(HttpRequest request, ActionContext actionCtx, ActionParameter parameter)
    {
        string queryKey = request.Query.First(x => 
            string.Compare(x.Key, parameter.Name, StringComparison.OrdinalIgnoreCase) == 0
            ).Key;
        // using queryKey to match in case insensitive manner
        string[] values = request.Query[queryKey];

        object stack = Activator.CreateInstance(parameter.Type);
        if (values.Any())
        {
            var details = new StackParameterDetails(parameter.Type.GetGenericArguments()[0]);
            var pushMethod = parameter.Type.GetMethod("Push", BindingFlags.Public | BindingFlags.Instance);
            foreach (var queryValue in values)
            {
                object value = ParseSingleQueryValue(
                    queryValue, 
                    details.BaseType, // needs to be base type, e.g. if parameter type is int? we need to pass int
                    details.IsNullable, 
                    parameter.Name, 
                    new Lazy<string>(() => actionCtx.Name)
                    );
                pushMethod.Invoke(stack, new[] { value });
            }
        }
        return stack;
    }

    private class StackParameterDetails
    {
        // TODO: cache result to improve performance
        public StackParameterDetails(Type type)
        {
            Type baseType;
            
            if (type.IsNullable(out baseType)) // extension method from LiteApi namespace
            {
                BaseType = baseType;
                IsNullable = true;
            }
            else
            {
                BaseType = type;
            }
        }

        public Type BaseType { get; set; }
        public bool IsNullable { get; set; }
    }
}
```

## Registering the binder

Once we have created the binder, we need to register it using `LiteApiOptions`
in `Startup` class `Configure` method.

```csharp
app.UseLiteApi(
    LiteApiOptions.Default
        .AddAdditionalQueryModelBinder(new StackQueryBinder())
        );
```

## Creating the controller

Now we can pass `Stack<T>` via query to any controller/action. A pitfall here
is that LiteApi does not know that we can pass `Stack<T>` via query so we need
to use `FromQuery` attribute on our parameter.

```csharp
public class StackController: LiteController
{
    public int NonNullCount([FromQuery]Stack<int?> s) => s.Count(x => x.HasValue);
}
```

## Result

Now we can call the controller with following URL and get `2` as a result. 
```
/api/stack/nonNullCount?s=&s=1&s=&s=3
```

<div class="alert alert-info">
This sample is taken from <a href="https://github.com/stanac/LiteApi/tree/master/LiteApi/LiteApi.Demo">Demo project</a>.
</div>