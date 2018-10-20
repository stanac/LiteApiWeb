---
Author: stanac
CreatedDate: 2017-04-26
Title: Versioning
RenderTitle: false
IsHtml: false
Id: versioning
---

## Versioning

For now you can version your APIs only with URLs using `LiteApi.ControllerRouteAttribute` as in

```csharp
[ControllerRoute("/api/v2/actors")] 
public class ActorsController : LiteController
{
    // ...
}
```

Versioning with headers are not supported at the moment, it's planned for version
[1.3](https://github.com/stanac/LiteApi/blob/master/roadmap.md).