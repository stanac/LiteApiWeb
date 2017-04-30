---
Author: stanac
CreatedDate: 2017-03-30
Title: Errors and common pitfalls
RenderTitle: false
IsHtml: false
ParentPageId: basic-concepts
Id: errors-and-common-pitfalls
---

# Errors and common pitfalls

LiteApi is built around **fail-fast** philosophy. That means if something is wrong, LiteApi will try to recognize the problem during startup and throw exception with meaningful message.

Here are listed some of the problems that might occur.

## Registration errors

**Multiple controllers with same name**

Make sure controller routes are unique. Controllers names are determined by class name or `ControllerRouteAttribute`.
It's possible to create multiple controller with same route, e.g. following controllers have same route:

```csharp
public class Person: LiteController { }

public class PersonController: LiteController { }

[ControllerRoute("/api/person")]
public class Persons: LiteController { }
```
---
**Authorization policy is not registered**

Authorization policies needs to be registered during startup, check [this article](/docs/policy-authorization). 

---
**Action has 0 (constant) route segments**

If controller is not RESTful and action has `ActionRouteAttribute` set, than ActionRouteAttribute must set 
at least one constant route segment, you can check [Action matching](/docs/action-matching) for more
information.

---
**Parameter from route segment with default value**

Parameters from route segment cannot have default value, e.g. following code will throw exception.

```csharp
public class EntityController: LiteController
{
    [ActionRoute({/entity/{type}/{id})]
    public object Entity(string type = "person", int id = 0)
    {
        // ...
    }
}
```

---
**Unsupported parameter type from route segment**

Route segment can provide parameters of types defined in [Supported parameter types](/docs/parameters-supported-types). Those types must be non nullable (except string, which cannot be null in runtime).

---
**HTTP methods GET and DELETE does not support parameters from body**

Parameters from body are supported only in `POST` and `PUT` methods. This can happen when
your controller class has a public method that accepts complex parameter. Check following sample code and
[Parameters from body](/docs/parameter-retrieving-from-body) documentation.

```csharp
public class PersonController: LiteController
{
    // ctor and other init code
    
    public Person Get(int id) => Convert(_service.Get(id));

    public PersonModel Convert(PersonDto person)
    {
       // code for converting PersonDto to PersonModel
    }
}
```
In example above we have public method `Convert`. Problem with this method is that LiteApi is recognizing
it like `GET` action, and `GET` actions cannot have parameters from body. Now LiteApi see that `PersonDto` is complex parameter and all complex parameters must come from  request body. In order to avoid this issue, 
you can set method to be private/internal/protected or use `DontMapToApiAttribute` on action.

---
**Multiple parameters from body found**

Only one parameter can come from body. Make sure you don't have more than one complex parameter type in
your method. All complex parameters are by default consider to come from body.

---
**Parameter is from route and there is no matching route segment found**

Parameter from route is defined but no matching route segment in found, here is an example of how to get this error (if you are so inclined).
```csharp
[Restful]
public class PersonController: LiteController
{
    [ActionRoute("/{personId}")] // notice that parameter name is different from parameter in method
    public Person Get([FromRoute]int id) => _service.Get(id);
}
```

---
**Route segment is set as parameter without matching parameter in method**

See previous error on this page and check example (make sure all parameters defined in `ActionRouteAttribute` has matching parameters in method).
```csharp
[Restful]
public class PersonController: LiteController
{
    [ActionRoute("/{type}/{id}")] // notice that parameter {type} is not defined in method
    public Person Get([FromRoute]int id) => _service.Get(id);
}
```

---
## Runtime errors

TBD, please report a bug on [GitHub](https://github.com/stanac/LiteApi/issues/new) if middleware related runtime error occurs.