---
Author: stanac
CreatedDate: 2017-04-15
Title: Claims based authorization
RenderTitle: false
IsHtml: false
Id: claims-authorization
ParentPageId: authorization
---

# Claims based authorization

There are four claim based authorization attributes. All can be applied to
controllers, actions or as [Global filters](/docs/global-filters) (global filters
will be implemented in v0.9).

All attributes can be combined, such as if more than one attribute is set on
controller or action, all attribute checks must be satisfied in order for user
to get access to controller/action.

All attributes are located in `LiteApi.Attributes` namespace.

## RequiresClaimsAttribute

This attribute requires calling user to have all required claims (one or more claims
can be set in the attribute).

```csharp
// constructor
public RequiresClaimsAttribute(params string[] claims)
```

```csharp
public class PersonsController: LiteController
{
    [RequiresClaims("GetPerson")] // "GetPerson" is claim type, values of the claim are not checked
    public Person Get(int id) => _service.Get(id);

    [HttpPost]
    [RequiresClaims("GetPeson", "SetPerson")] 
    // "GetPerson" and "SetPerson" are claim types, values of the claims are not checked
    // User needs to have all of the claim types in order to access this action
    public Person Add(Person model) => _service.Add(model);
}
```

Developer needs to provide at least one claim type in constructor of this attribute.
None of the provided claims (to constructor) can be null or empty or white space.

## RequiresAnyClaimAttribute

This attribute requires calling user to have any of the provided claim types (one or more claims
can be set in the attribute).

```csharp
// constructor
public RequiresAnyClaimAttribute(params string[] claims)
```

```csharp
public class PersonsController: LiteController
{
    [RequiresAnyClaim("GetPerson", "GlobalGet")] 
    // "GetPerson" and "GlobalGet" are claim types, values of the claims are not checked
    // User needs to have at least one of the claim types in order to access this action
    public Person Get(int id) => _service.Get(id);

    [HttpPost]
    [RequiresAnyClaim("SetPerson", "GlobalSet")] 
    // "GetPerson" and "SetPerson" are claim types, values of the claims are not checked
    // User needs to have at least one of the claim types in order to access this action
    public Person Add(Person model) => _service.Add(model);
}
```

Developer needs to provide at least one claim type in constructor of this attribute.
None of the provided claims (to constructor) can be null or empty or white space.

## RequiresClaimWithValuesAttribute

This attribute requires calling user to have specific claim with all of the claim
values provided in the attribute constructor.

```csharp
// constructor
public RequiresClaimWithValuesAttribute(string claimType, params string[] claimValues)
```

```csharp
public class PersonsController: LiteController
{
    [RequiresClaimWithValues("ReadAccess", "person", "entity")]
    // User must have claim "ReadAccess" with both "person" value and "entity" value
    public Person Get(int id) => _service.Get(id);
}
```
Developer needs to provide claim type and at least one claim value
in constructor of this attribute.
None of the provided parameters (to constructor) can be null or empty or white space.

## RequiresClaimWithAnyValueAttribute

This attribute requires calling user to have specific claim with 
any of the claim values provided in the attribute constructor.

```csharp
// constructor
public RequiresClaimWithAnyValueAttribute(string claimType, params string[] claimValues) 
```

```csharp
public class PersonsController: LiteController
{
    [RequiresClaimWithAnyValue("ReadAccess", "person", "entity")]
    // User must have claim "ReadAccess" with "person" value or "entity" value
    public Person Get(int id) => _service.Get(id);
}
```
Developer needs to provide claim type and at least one claim value
in constructor of this attribute.
None of the provided parameters (to constructor) can be null or empty or white space.
