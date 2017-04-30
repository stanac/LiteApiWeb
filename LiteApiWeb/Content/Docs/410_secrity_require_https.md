---
Author: stanac
CreatedDate: 2017-04-15
Title: Require HTTPS
RenderTitle: false
IsHtml: false
Id: require-https
ParentPageId: security
---

# Security - Require HTTPS

LiteApi can reject all non HTTPS requests on middleware level, controller level or
action level.  

## Require HTTPS on controller or action

On controller or action `LiteApi.Attributes.RequiresHttpsAttribute` can be set
in order to force HTTPS.

```csharp
public class PersonsController: LiteController
{
    // ctor and other code...

    // only on action level
    [RequiresHttps]
    public PersonModel Get(int id) => _service.Get(id);
}

[RequiresHttps] // on all actions in the controller
public class BooksController: LiteController
{
    // ctor and other code...

    public BookModel Get(int id) => _service.Get(id);
}
```

By default `RequiresHttpsAttribute` ignores `SkipFiltersAttribute`. In
order to stop ignoring `SkipFiltersAttribute` property `IgnoreSkipFilters` needs
to be set to `false`.

```csharp
[RequiresHttps, RequiresAuthentication]
public class PersonsController: LiteController
{
    // ctor and other code...

    [SkipFilters] // only RequiresAuthentication will be skiped
    public PersonModel Get(int id) => _service.Get(id);
}

[RequiresHttps(IgnoreSkipFilters = false), RequiresAuthentication]
public class BooksController: LiteController
{
    // ctor and other code...

    [SkipFilters] // both filters will be skiped
    public BookModel Get(int id) => _service.Get(id);
}
```

Default behaviour is usually what is needed in most scenarios where user can
access some `Login` action but has to do it over `HTTPS`.

---

## Require HTTPS on middleware

LiteApi can be configurated to require HTTPS on all actions in the middleware by
calling `LiteApiOptions.SetRequiresHttps` in `Startup.Configure` method.

```csharp
public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
{
    app.UseLiteApi(
        LiteApiOptions.Default.SetRequiresHttps(true)
        );
}
```