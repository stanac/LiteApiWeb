---
Author: stanac
CreatedDate: 2017-04-15
Title: Authorization
RenderTitle: false
IsHtml: false
Id: authorization
ParentPageId: security
---

# Authorization

Authorization is implemented using one or more attributes (all located in `LiteApi` namespace):
- RequiresAuthentication
- RequiresAuthorizationPolicy
- RequiresClaims
- RequiresAnyClaim
- RequiresClaimWithValues
- RequiresClaimWithAnyValue
- RequiresRoles
- RequiresAnyRole

Authorization can also be implemented using [Custom attribute](/docs/custom-authorization).

For more information check one of the related pages:
- [Require authentication](/docs/require-authentication)
- [Claims based authorization](/docs/claims-authorization)
- [Roles based authorization](/docs/roles-authorization)
- [Policy based authorization](/docs/policy-authorization)
- [Custom authorization](/docs/custom-authorization)

All authorization attributes (`Requires...Attribute`) are first checking
if user is authenticated and then performing attribute specific check.

## Skiping authorization on action

Authorization filters on controller level can be ignored using `SkipFiltersAttribute`
as in following example:

```csharp
[RequiresAuthentication]
public class UserController: LiteController
{
    public User GetLoggedInUser() => _service.GetCurrent(this.HttpContext);

    [HttpPost]
    public bool Logout() => _service.Logout(this.HttpContext);

    [HttpPost, SkipFilters] // all actions in this controller except this one require authentication
    public LoginResultModel Login(LoginModel model) => _service.Login(model, this.HttpContext);
}
```