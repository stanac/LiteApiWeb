---
Author: stanac
CreatedDate: 2017-04-15
Title: From header
RenderTitle: false
IsHtml: false
Id: parameter-retrieving-from-header
ParentPageId: parameter-retrieving
---

# Parameter retrieving from header

Parameters can be retrieved from HTTP request header. Parameter to be received from
header must have `LiteApi.Attributes.FromHeaderAttribute` set. See following
examples.

Parameter name and header key doesn't have to match, but in they don't match
header key must be set in the attribute constructor.

```csharp
public class HeaderParametersController: LiteController
{
    // parameter values will be retrieved from headers "i" and "x-overriden-param-name-j"
    public int Add([FromHeader]int i, [FromHeader("x-overriden-param-name-j")]int j) => i + j;
}
```

All simple types (check [supported types](/docs/parameters-supported-types))
can be received from header and nullable equivalents of simple types.

Collections, dictionaries and complex types cannot be received from header.