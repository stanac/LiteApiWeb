---
Author: stanac
CreatedDate: 2017-04-15
Title: Policy based authorization
RenderTitle: false
IsHtml: false
Id: policy-authorization
ParentPageId: authorization
---

# Policy based authorization

Policy based authorization can be used when none of the existing attributes
cover authorization requirements of your API. Policy based authorization
can be applied to controllers, actions or as [Global filters](/docs/global-filters) 
(global filters will be implemented in v0.9).

Policies are defined as `Func<ClaimsPrincipal, bool>` with specified name as `string`.
Policies must be registered during registration of the middleware in `Startup`
class.


```csharp
// Startup.cs file
app.UseLiteApi(LiteApiOptions.Default  
    .AddAuthorizationPolicy("Over18", user =>
    {
        // GetFirstNullableInt is extension method, you would need to add "using LiteApi;" to use it.
        int? value = user.Claims.GetFirstNullableInt("Age");
        return value.HasValue && value.Value >= 18;
    })
    // .AddAuthorizationPolicy("AnotherPolicy", user => // ...
    );
```

Once policy is defined, it can be applied to controller or action using
`LiteApi.RequiresAuthorizationPolicyAttribute`.

Constructor:
```csharp
public RequiresAuthorizationPolicyAttribute(string policyName)
```

Sample:
```csharp
public class TicketController: LiteController
{
    [HttpPost]
    [RequiresAuthorizationPolicy("Over18")]
    public OrderResult OrderTicket(OrderModel model) => _service.Order(model);
}
```

Policy name cannot be null, empty or white space

If `ClaimsPrincipal` does not provide enough information to authorize user
you should check [Custom authorization page](/docs/custom-authorization).