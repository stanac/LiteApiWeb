---
Author: stanac
CreatedDate: 2017-04-15
Title: Supported types
RenderTitle: false
IsHtml: false
Id: parameters-supported-types
ParentPageId: parameter-retrieving
---

# Supported types

For LiteApi following types are considered as simple types:

- `bool`
- `string`
- `char`
- `Int16`
- `Int32`
- `Int64`
- `UInt16`
- `UInt32`
- `UInt64`
- `Byte`
- `SByte`
- `decimal`
- `float`
- `double`
- `DateTime`
- `Guid`

Parameter types supported by **query** are all simple types and following types
where `T`, `TKey` and `TValue` are all simple types.

- `IEnumerable<T>`
- `List<T>`
- `T[]`
- `Dictionary<TKey, TValue>`
- `IDictionary<TKey, TValue>`
- `Nullable<T>`

Parameter types supported by **route segment** are all simple types (no nullable 
variants).

Parameters supported by **request header** are all simple types. Collections are 
not supported, nullable variants are supported.

Parameters supported by **body** are all parameter types, but there can be maximum one
parameter received from body.

Action can receive parameters of any type from **services** with condition 
that parameter type is registered in app's DI container.

## Working with nullable parameters

In order for action to receive null as parameter value, parameter must be 
`Nullable<T>` (e.g. `int?`) where `T` is any of the previously listed
types with exception of `string`. Nullable parameters are supported in
query and header. For example in query we can have action like in the sample
below.

For action to receive null, we must provide name of the parameter (in query parameters)
or header name (in header parameters) and empty string as value of the parameter.
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

For parameters from body to be received as `null` JSON serializer needs to handle
null values. Default (Json.NET) serializer will deserialize value to `null`
if body is empty or has value `null`.