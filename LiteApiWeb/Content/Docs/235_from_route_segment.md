---
Author: stanac
CreatedDate: 2017-04-15
Title: From route segment
RenderTitle: false
IsHtml: false
Id: parameter-retrieving-from-route-segment
ParentPageId: parameter-retrieving
---

# Parameter retrieving from route segment

Parameters can be received from route segment, which makes URLs on which API
is responding more attractive.

All simple types (check [supported types](/docs/parameters-supported-types))
can be received from route segment. Nullable variants are not supported. Collections
and dictionaries are not supported for parameters from route segment.

Matching of parameters is done by name of the parameter and name of the route segment.
Matching is case insensitive. Route segments that holds parameter values
must be escaped with `{` and `}` in `ActionRouteAttribute`.

If we want to be explicit we can use `LiteApi.Attributes.FromRouteAttribute`.

Following two samples are equivalent.

```csharp
[Restful]
public class EntitiesController : LiteController
{
    // will respond to /api/entities/person/5
    [ActionRoute("{type}/{id}")]
    public EntityModel GetEntity(string type, int id) => _service.Get(type, id)
}
```

```csharp
[Restful]
public class EntitiesController : LiteController
{
    // will respond to /api/entities/person/5
    [ActionRoute("{type}/{id}")]
    public EntityModel GetEntity([FromRoute] string type, [FromRoute] int id) => _service.Get(type, id)
}
```

`ActionRouteAttribute` can also have constants, see example.

```csharp
public class MathController: LiteController
{
    // will respond to /api/math/5/plus/7
    [ActionRoute("/{i}/plus/{j}")]
    public int Add(int i, int j) => i + j;

    // will respond to /api/math/5/minus/7
    [ActionRoute("/{i}/minus/{j}")]
    public int Subtract(int i, int j) => i - j;

```