---
Author: stanac
CreatedDate: 2017-04-15
Title: Custom authorization
RenderTitle: false
IsHtml: false
Id: custom-authorization
ParentPageId: authorization
---

# Custom authorization

You can implement your own custom authorization filter attribute by implementing
`IApiFilter` or `IApiFilterAsync` interface. 
Both interfaces are located in `LiteApi.Contracts.Abstractions` namespace. 
It is recommended to check first [Policy based authorization](/docs/policy-authorization), 
it's easier to implement, and provide
custom authorization capabilities.

How to define custom authorization attribute filter:

```csharp
[AttributeUsage(AttributeTargets.Method | AttributeTargets.Class)]
private class UserHasAnyTwoClaimsAttribute : Attribute, IApiFilter  
{
    // tells middleware not to ignore SkipFiltersAttribute
    public bool IgnoreSkipFilters => false;

    public ApiFilterRunResult ShouldContinue(HttpContext httpCtx)
    {
        var userIsAuthenticated = httpCtx?.User?.Identity.IsAuthenticated ?? false;
        if (!userIsAuthenticated) return ApiFilterRunResult.Unauthenticated;

        return httpCtx.User.Claims.Count() > 1
            ? ApiFilterRunResult.Continue
            : ApiFilterRunResult.Unauthorized;
        
        // when manually instantiating ApiFilterRunResult
        // you can set response message, response code and ShouldContinue boolean value
    }
}
```

After creating custom filter, it can be used as any other authorization attribute.

```csharp
[UserHasAnyTwoClaims]
public class PersonsController:LiteController
{
    // ...
}
```

If you are interested in API key/secret type of authorization
you can check [this post](/blog/2017-07-22/key-secret-auth).