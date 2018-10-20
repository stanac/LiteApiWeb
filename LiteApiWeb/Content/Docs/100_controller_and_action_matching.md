---
Author: stanac
CreatedDate: 2017-04-15
Title: Controller and action matching
RenderTitle: false
IsHtml: false
Id: controller-and-action-matching
---

# Controller and action matching

It is recommended to first check [Getting started](/docs/getting-started).

## Controllers

<div class="alert alert-warning">
All controllers must inherit `LiteApi.LiteController` class. All attributes used by LiteApi can be found under LiteApi namespace.
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

## Actions

Actions are by default matched on name as in `/api/{controller}/{action}`.

This behavior can be changed using `RestfulAttribute` and `ActionRouteAttribute`:

```csharp
[Restful] 
public class ActorsController : LiteController
{
    // ... ctor and other code ...
    
    public ActorModel Get(int id) => _service.Get(id);
}

public class BooksController : LiteController
{
    // ... ctor and other code ...
    
    public Book Get(int id) => _service.Get(id);
}
```

In this case actor can be retrieved on `/api/actors?id=5` and book can be retrieved using 
`/api/books/get?id=5` URL.

Using combination of `RestfulAttribute` and `ActionRouteAttribute` we can create
RESTful API, where we cab retrieve book with id `5` with URL `/api/books/5`.

```csharp
[Restful]
public class BooksController : LiteController
{
    // ... ctor and other code ...
    
    [ActionRoute('/{id}')]
    public Book Get(int id) => _service.Get(id);
}
```

`ActionRouteAttribute` can tell LiteApi to [retrieve parameter value from route segment](/docs/parameter-retrieving-from-route-segment) and it can change action matching segment if we don't want to write RESTful actions.

```csharp
public class BooksController : LiteController
{
    // ... ctor and other code ...
    
    [ActionRoute('/get/the/book/{id}')]
    public Book Get(int id) => _service.Get(id);
}
```

In the example above book with id 5 can be retrieved by URL `/api/books/get/the/book/5`.

Action route can specify arbitrary number of parameter (zero or more).

```csharp
public class MathController: LiteController
{
    [ActionRoute("/{a}/minus/{b}")]
    public int Minus(int a, int b) => a - b;
}
```

`MathController` in this case have `Minus` action that will respond to `/api/math/5/minus/3`;

<div class="alert alert-info">
Please note that using multiple attributes of same time is not allowed on controllers and actions.
</div>

As you might have noticed all actions in presented examples are responding to HTTP `GET`.
If we want to use some other HTTP method to target our actions we can use one of the following
attributes:
- `LiteApi.HttpGet`
- `LiteApi.HttpPost`
- `LiteApi.HttpPut`
- `LiteApi.HttpDelete`

For more information check [Action matching](/docs/action-matching).

<hr/>

Related topics:
- [Action matching](/docs/action-matching)
- [Controller matching](/docs/controller-matching)
- [Parameter retrieving](/docs/parameter-retrieving)
