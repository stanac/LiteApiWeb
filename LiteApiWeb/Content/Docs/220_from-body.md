---
Author: stanac
CreatedDate: 2017-04-15
Title: From body
RenderTitle: false
IsHtml: false
Id: parameter-retrieving-from-body
ParentPageId: parameter-retrieving
---

# Parameter retrieving from body

All parameter types can be retrieved from body, condition is that there is 
no more than one parameter expected from body in single action.
By convention all complex parameter types (for
simple parameter types check [Supported types](/docs/parameters-supported-types))
are expected to come from body.

LiteApi is currently supporting only JSON, so body parameter needs to be JSON serialized.
If we want to be explicit we can use `LiteApi.Attributes.FromBodyAttribute`
to specify that parameter is coming from body. Same attribute needs to be used
if we want to provide simple-type parameter via body.

Following two samples are equivalent since `PersonModel` is complex type.

```csharp
[Restful]
public class PersonsController: LiteController
{
    [HttpPost]
    public PersonModel Add(PersonModel model) => _service.Add(model);
}
```

```csharp
[Restful]
public class PersonsController: LiteController
{
    [HttpPost]
    public PersonModel Add([FromBody] PersonModel model) => _service.Add(model);
}
```

Following sample shows how to set source of simple-type parameter to be from body.

```csharp
[Restful]
public class InternalSearchController: LiteController
{
    [HttpPost]
    // in this case [FromBodyAttribute] is necessary because
    // we want to receive simple type parameter from body
    public SearchResult Search([FromBody] string searchTerm) => _service.Search(searchTerm);
}
```