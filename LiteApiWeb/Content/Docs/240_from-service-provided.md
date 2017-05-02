---
Author: stanac
CreatedDate: 2017-04-15
Title: From service provider (DI container)
RenderTitle: false
IsHtml: false
Id: parameter-retrieving-from-service-provider
ParentPageId: parameter-retrieving
---

# Parameter retrieving from service provider

Sometimes there is just one action in controller that depends on a service.
In order to avoid injecting the service for all action calls in that 
controller we can inject the service only when appropriate action 
method is called. This can be done using `FromServicesAttribute` 
(located in `LiteApi.Attributes` namespace) which should be set on 
parameter level. Here is an example:

```csharp
public int Add(int a, int b, [FromServices]IMathOps theService)  
{
    return theService.Add(a, b);
}
```

It should be noted that you can have regular parameters from body/query/route/header
next to your dependency-injected parameter, order of parameters is not important. 
Dependency-injected parameter is resolved from IServiceProvider, so any service
that is registered on app level can be retrieved this way. It is possible to
injected more than one parameter this way.