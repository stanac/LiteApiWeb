---
Author: stanac
CreatedDate: 2017-04-15
Title: Retrieving collections
RenderTitle: false
IsHtml: false
Id: parameters-retrieving-collections
ParentPageId: parameter-retrieving
---

# Parameter - retrieving collections

Collections are supported by parameters from query and body. Body can receive any
collection as long as it can be deserialized from JSON.

Supported collections from query are
- `IEnumerable<T>`
- `List<T>`
- `T[]`

Where `T` is one of the simple types (check [Supported types](/docs/parameters-supported-types))
or nullable variant of a simple types.

Collection is provided by repeating parameter name as query key with multiple
values. Following sample will respond to `/api/math/sum?i=1&i=5&i=3&i=3` and
return 12.

```csharp
public class MathController: LiteController
{
    public int Sum(int[] i) => i.Sum();
}
```