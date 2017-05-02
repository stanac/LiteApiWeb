---
Author: stanac
CreatedDate: 2017-04-15
Title: Retrieving dictionaries
RenderTitle: false
IsHtml: false
Id: parameters-retrieving-dictionaries
ParentPageId: parameter-retrieving
---

# Parameter - retrieving dictionaries

LiteApi action can receive dictionary from body or query. From body any
dictionary (any object) can be received as long as it can be deserialized
from JSON.

From query following parameter types are supported:
- `Dictionary<TKey, TValue>`
- `IDictionary<TKey, TValue>`

Where `TKey` and `TValue` are simple types (check [Supported types](/docs/parameters-supported-types))
or nullable variants of simple types.


```csharp
public class DictionaryController : LiteController
{
    public IDictionary<int, string> Join(IDictionary<int, string> a, Dictionary<int, string> b)
    {
        Dictionary<int, string> c = new Dictionary<int, string>();
        foreach (var keyValue in a)
        {
            c[keyValue.Key] = keyValue.Value;
        }
        foreach (var keyValue in b)
        {
            c[keyValue.Key] = keyValue.Value;
        }
        return c;
    }
}
```

If we call action from sample above with:

```
/api/dictionary/join?a.1=one&a.3=three&b.2=two&b.4=four
```

It will return

```json
{  
  "1":"one",
  "3":"three",
  "2":"two",
  "4":"four"
}
```

From the sample it can be concluded that dictionary value is passed
by repeating key-value pairs, where key-value pair is set in format 

```
parameter1.key1=value1&parameter1.key2=value2&parameter2.key1=value1&parameter2.key2=value2
```

This means that key and value cannot contain `.`, if it does developers needs
to find a way to encode it and decode it.