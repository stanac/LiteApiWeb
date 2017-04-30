---
Author: stanac
CreatedDate: 2017-04-15
Title: Roles based authorization
RenderTitle: false
IsHtml: false
Id: roles-authorization
ParentPageId: authorization
---

# Roles authorization

Roles authorization is just an abstraction over claims. Roles are just
special type of claims. There are two filter attributes that are authorizing
access by checking user roles.

As all `Requires...Attribute` filters, roles based attributes can be used
on actions, controllers or as [Global filters](/docs/global-filters) (Global
filters will be implemented in v0.9).

## RequiresRolesAttribute

Constructor:
```csharp
public RequiresRolesAttribute(params string[] roles)
```

Sample:
```csharp
public class CustomersController: LiteController
{
    [HttpPost]
    // User needs to be in both roles ("CrmUser" and "CustomerWriter") in order to access this action
    [RequiresRoles("CrmUser", "CustomerWriter")]
    public CustomerModel Add(CustomerModel person) => _service.Add(person);
}
```


## RequiresAnyRoleAttribute

Constructor:
```csharp
public RequiresAnyRoleAttribute(params string[] roles)
```

Sample:
```csharp
public class CustomersController: LiteController
{
    [HttpPost]
    // User needs to be in any of the roles("CrmAdmin" or "CustomerWriter") in order to access this action
    [RequiresAnyRole("CrmAdmin", "CustomerWriter")]
    public CustomerModel Add(CustomerModel person) => _service.Add(person);
}
```

For both attributes developer must provide at least one role in attribute constructor.
Roles cannot be null, empty or white space in the constructors.