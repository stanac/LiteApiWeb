---
Author: stanac
CreatedDate: 2017-08-24
Title: Changing API url root
RenderTitle: false
IsHtml: false
Id: changing-api-url-root
---

## Changing API URL root

Since version 0.9.0 it is possible to change root of API URL.

For example here is a controller which responds to: `/api/persons`.

```csharp
[Restful]
public PersonsController: LiteController
{
    public IEnumerable<Person> GetAll() => //...
}
```

We can change root URL of the middleware so all our controllers respond to 
`/api-awesome/[controller]` which means controller from example above
will respond to `/api-awesome/persons`. We can change API URL root by calling
`LiteApiOptions.SetApiUrlRoot(string)` and providing the options when
registering the middleware. Here is a sample from `Startup.`.

```csharp
var options = LiteApiOptions
    .Default
    .SetApiUrlRoot("api-awesome/");
app.UseLiteApi(options);
```

**Please note:** this option will not affect controllers which have 
`ControllerRouteAttribute` set. Those type of controller will
respond to whatever URL is set in the attribute.