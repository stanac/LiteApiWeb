---
Author: stanac
CreatedDate: 2017-11-02
Title: Replacing internal service resolver
RenderTitle: false
IsHtml: false
Id: replacing-liteapi-service-resolver
ParentPageId: replacing-internal-services
---

## Replacing ILiteApiServiceResolver

`LiteApi` has internal dependency resolver (IoC contrainter) 
that is specifically  crafter for the middleware needs. Dependency resolver 
implements following interface:

```csharp
public interface ILiteApiServiceResolver
{
    void Initialize(IServiceProvider serviceProvider, LiteApiOptions options);
    
    IActionDiscoverer GetActionDiscoverer();
    IActionInvoker GetActionInvoker();
    IJsonSerializer GetJsonSerializer();
    IActionsValidator GetActionsValidator();
    IAuthorizationPolicyStore GetAuthorizationPolicyStore();
    IControllerBuilder GetControllerBuilder();
    IControllerDiscoverer GetControllerDiscoverer();
    IControllersValidator GetControllerValidator();
    IParametersDiscoverer GetParametersDiscoverer();
    IPathResolver GetPathResolver();
    IParametersValidator GetParametersValidator();
    ILiteApiOptionsRetriever GetOptionsRetriever();
    
    object Resolve(Type interfaceType);
    T Resolve<T>() where T : class;
    
    void Register<TInterface, TService>() where TService : class;
    void Register<TInterface>(Func<TInterface> factory);
    void RegisterSingleton<TInterface, TService>() where TService : class;
    void RegisterInstance<TInterface>(object instance);

    bool IsServiceRegistered<TInterface>();
    bool IsServiceRegistered(Type tInterface);
}
```

For full file content please check [GitHub repo](https://github.com/stanac/LiteApi/blob/master/LiteApi/LiteApi/Contracts/Abstractions/ILiteApiServiceResolver.cs).
Default implementation can be seen [here](https://github.com/stanac/LiteApi/blob/master/LiteApi/LiteApi/Services/LiteApiServiceResolver.cs).

It's possible to replace default implementation with you own
when registering the middleware in `Startup.cs`:

```csharp
// Startup.cs - Configure method

LiteApiOptions options = LiteApiOptions.Default
    .ReplaceInternalServiceResolver(myServiceResolver);
app.UseLiteApi(options);
```

---
Related:
 - [Replacing internal services](/docs/replacing-internal-services)