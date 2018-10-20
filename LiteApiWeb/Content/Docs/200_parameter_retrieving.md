---
Author: stanac
CreatedDate: 2017-04-15
Title: Parameter retrieving
RenderTitle: false
IsHtml: false
Id: parameter-retrieving
---

# Parameter retrieving

Parameters can be retrieved from:
- Query
- Route segment
- Body
- Header
- DI container

If you like to be explicit, you can use on parameter level one of the attributes:

- `LiteApi.FromQueryAttribute`
- `LiteApi.FromRouteAttribute`
- `LiteApi.FromBodyAttribute`
- `LiteApi.FromHeaderAttribute`
- `LiteApi.FromServicesAttribute`

## Convetions

All primitive type parameters without one of the attributes, as well arrays, dictionaries, and nullable variants of
primitive types are considered to come from query. For more info check [Supported types](/docs/parameters-supported-types).
All parameters of complex types are considered to come from body.

```csharp
[Restful]
public class ActorsController: LiteController
{
    private readonly ActorService _service = new ActorService();

    // id is retrieved from query as in /api/actors?id=5
    public ActorModel Get(int id) => _service.Get(id);

    // model is comming from body
    public ActorModel Post(ActorModel model) => _service.Add(model);
}
```

Controller from code above is same as the next one, only difference is that we are
setting source of parameter values explicitly.

```csharp
[Restful]
public class ActorsController: LiteController
{
    private readonly ActorService _service = new ActorService();

    // id is retrieved from query as in /api/actors?id=5
    public ActorModel Get([FromQuery] int id) => _service.Get(id);

    // model is comming from body
    public ActorModel Post([FromBody] ActorModel model) => _service.Add(model);
}
```

For more information you can check (From query)[/docs/parameter-retrieving-from-query] 
and (From body)[/docs/parameter-retrieving-from-body].

---

All simple type parameters that have matching names in route segments are considered
to be retrieved from route segment.

```csharp
[Restful]
public class ActorsController: LiteController
{
    private readonly ActorService _service = new ActorService();

    // id is retrieved from query as in /api/actors/5
    [ActionRoute("/{id}")]
    public ActorModel Get(int id) => _service.Get(id);
}
```

Controller from code above is same as the next one, only difference is that we are
setting source of parameter value explicitly.

```csharp
[Restful]
public class ActorsController: LiteController
{
    private readonly ActorService _service = new ActorService();

    // id is retrieved from query as in /api/actors/5
    [ActionRoute("/{id}")]
    public ActorModel Get([FromRoute] int id) => _service.Get(id);
}
```

For more information check [From route segment](/docs/parameter-retrieving-from-route-segment) page.

---

Related docs:
- [Retrieving parameters from header](/docs/parameter-retrieving-from-header)
- [Retrieving parameters from service provider (DI container)](/docs/parameter-retrieving-from-service-provider)
- [Retrieving arrays, lists and IEnumerable<T>](/docs/parameters-retrieving-arrays)
- [Retrieving Dictionary<TKey, TValue> and IDictionary<TKey, TValue>](/docs/parameters-retrieving-dictionaries)
- [Creating custom parameters provider](/docs/custom-parameter-provider)