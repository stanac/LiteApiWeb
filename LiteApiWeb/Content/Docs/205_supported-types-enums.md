---
Author: stanac
CreatedDate: 2017-10-02
Title: Working with Enums
RenderTitle: false
IsHtml: false
Id: parameters-enums
ParentPageId: parameters-supported-types
---

# Working with Enums

LiteApi supports passing `Enum` values from route, query, header and body.
Enum value should be passed as string value and parsing is done in case
insensitive manner.

Please note that `EnumMemberAttribute`, `DescriptionAttribute` or
any other attribute won't be considered when parsing enum values from query,
header or route segment. When parsing enum values from body JSON de/serializer
will use it's specific settings. For JSON de/serializer settings please check
[this page](/docs/changing-json-serializer).

`EnumMemberAttribute` might be supported in future. Please
raise an issue on [GitHub](https://github.com/stanac/LiteApi/issues) 
if you need it ASAP.

An example:

```csharp
public class EntityController: LiteController
{
    // will respond to e.g. /api/entity/person/type-name
    [ActionRoute("{e}/type-name")]
    public string ToString(Entity e)
    {
        return e.ToString();
    }
}

public enum Entity
{
    Person, Company, Account
}
```