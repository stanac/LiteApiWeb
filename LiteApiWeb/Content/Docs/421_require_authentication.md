---
Author: stanac
CreatedDate: 2017-04-15
Title: Require authentication
RenderTitle: false
IsHtml: false
Id: require-authentication
ParentPageId: authorization
---

# Require authentication

`LiteApi.RequiresAuthenticationAttribute` is simplest of all
authorization filters. It requires for user to be logged in and authenticated
when calling the controller or action.

As all other filters `Requires...Attribute` can be applied to 
controller, action or as [Global filter](/docs/global-filters) (global filters will be implemented in v0.9).

```csharp
// all actions in this controller except Login require authentication
[RequiresAuthentication]
public class UserController: LiteController
{
    public User GetLoggedInUser() => _service.GetCurrent(this.HttpContext);

    [HttpPost]
    public bool Logout() => _service.Logout(this.HttpContext);

    [HttpPost, SkipFilters]
    public LoginResultModel Login(LoginModel model) => _service.Login(model, this.HttpContext);
}



// Only add action requires authentication
public class PersonsController: LiteController
{
    public PersonModel Get(int id) => _service.Get(id);

    public IEnumerable<PersonModel> All() => _service.All();

    [HttpPost, RequiresAuthentication]
    public PersonModel Add(PersonModel model) => _service.Add(model);
}
```