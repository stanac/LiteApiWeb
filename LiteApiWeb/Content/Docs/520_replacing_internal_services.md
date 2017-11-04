---
Author: stanac
CreatedDate: 2017-07-22
Title: Replacing internal services
RenderTitle: false
IsHtml: false
Id: replacing-internal-services
---

## Replacing internal services

It is possible for API application to replace default implementations of
following internal services in the middleware:

 - `IActionDiscoverer`
 - `IActionInvoker`
 - `IActionsValidator`
 - `IAuthorizationPolicyStore`
 - `IControllerBuilder`
 - `IControllerDiscoverer`
 - `IControllersValidator`
 - `IJsonSerializer`
 - `IParametersDiscoverer`
 - `IPathResolver`
 - `IParametersValidator`

As an example we can replace default implementation of 
`IControllerDiscoverer` to allow our controller names
to end with `Ctrl` as in `PersonsCtrl`. First we need to inherit default
implementation and override necessary method.

```csharp
public class CustomControllerDiscoverer : ControllerDiscoverer
{
    public CustomControllerDiscoverer(IActionDiscoverer actionDiscoverer)
        :base(actionDiscoverer)
    {
    }

    protected override string GetControllerName(string typeFullName)
    {
        var name = base.GetControllerName(typeFullName);
        if (name.EndsWith("ctrl", StringComparison.Ordinal))
            name = name.Substring(0, name.Length - 4);
        return name;
    }
}
```

After we have new implementation of internal LiteApi service, we need to register it
during middleware registration in `Startup` class.

```csharp
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
    }
    
    public void Configure(
        IApplicationBuilder app, 
        IHostingEnvironment env, 
        ILoggerFactory loggerFactory)
    {
        // REGISTER LITE API WITH CUSTOM IControllerDiscoverer
        var options = LiteApiOptions.Default;
        options.InternalServiceResolver.Register<IControllerDiscoverer, CustomControllerDiscoverer>();
        app.UseLiteApi(options);
        
        app.Run(async context =>
        {
            context.Response.StatusCode = 404;
            await context.Response.WriteAsync("404 - NOT FOUND");
        });
    }
}
```

---
Related:
 - [Replacing internal service resolver](/docs/replacing-liteapi-service-resolver)