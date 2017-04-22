---
Author: stanac
CreatedDate: 2017-04-15
Title: Controller matching
RenderTitle: false
IsHtml: false
Id: controller-matching
ParentPageId: controller-and-action-matching
---

# Controller matching

It is recommended to first check [Getting started](/docs/getting-started).

## Controllers

<div class="alert alert-warning">
All controllers must inherit <code>LiteApi.LiteController</code> class. All attributes used by LiteApi can be found under LiteApi.Attributes namespace.
</div>

<div class="alert alert-info">
All routes and parameters are case insensitive.
</div>

This is quick overview with samples, for specific topic check subsections on the left under "Controller and action matching".

All controller are matched on URL `/api/{controller}`. If controller class name ends "Controller", "Controller" suffix with will be stripped from matching URL.

Controller route can be configurated using `ControllerRouteAttribute` as in:

```csharp
[ControllerRoute("/api/v2/actors")] 
public class ActorsController : LiteController
{
}

public class BooksController : LiteController
{
}
```

In this case `ActorsController` will match `/api/v2/actors` route and `BooksController` 
will match `/api/books`.

By default LiteApi will recognize controllers only in you main assembly, if you want to 
use controlles from other assemblies please check [Controller recognition](/docs/controller-registration).
