---
Author: stanac
CreatedDate: 2017-04-15
Title: From query
RenderTitle: false
IsHtml: false
Id: parameter-retrieving-from-query
ParentPageId: parameter-retrieving
---

# Parameter retrieving from query

All simple types (check [supported types](/docs/parameters-supported-types))
can be received from query as well as following types where `T`, `TKey`
and `TValue` are simple types.

- `IEnumerable<T>`
- `List<T>`
- `T[]`
- `Dictionary<TKey, TValue>`
- `IDictionary<TKey, TValue>`
- `Nullable<T>`

For collections check:
- [Retrieving collections](/docs/parameters-retrieving-arrays)
- [Retrieving dictionaries](/docs/parameters-retrieving-dictionaries)

By default all query-supported types are received from query. We can also explicitly
say that parameter is from query with `LiteApi.FromQueryAttribute`.
Parameter name must match query key, matching is done in case insensitive manner.

## Samples

Following two samples are equivalent.

```csharp
[Restful]
public class ActorsController: LiteController
{
    // id is retrieved from query as in /api/actors?id=5
    public ActorModel Get([FromQuery] int id) => _service.Get(id);
}
```

```csharp
[Restful]
public class ActorsController: LiteController
{
    // id is retrieved from query as in /api/actors?id=5
    public ActorModel Get(int id) => _service.Get(id);
}
```


## Working with nullable parameters

In order for action to receive null as parameter value, parameter must be 
`Nullable<T>` (e.g. `int?`) where `T` is any of the previously listed
types with exception of `string`. For example in query we can have action 
like in the sample below.

For action to receive null, we must provide name of the parameter in query
and empty string as value of the parameter.
If parameter name is missing exception will be thrown.

```csharp
public class MathController: LiteController
{
    // /api/math/zeroOrValue?n=
    //      returns 0, n will be null 
    //
    // /api/math/zeroOrValue
    //      throws exception, parameter is not provided
    public int ZeroOrValue(int? n) => n ?? 0;
}
```