---
Author: stanac
CreatedDate: 2018-05-20
Title: Release 2.0.0
RenderTitle: true
IsHtml: false
Id: release-2_0_0
RenderShort: True
---

LiteApi 2.0.0 released

<!-- short end -->

**Changes and fixes:**
- **Breaking change.** Dropped support for netstandard < 2.0
- **Breaking change.** Attributes are no longer in `LiteApi.Attributes` namespace, they are in `LiteApi` namespace
- Fixed XML documentation issue where IntelliSense didn't show documentation
- `Json.NET` dependency updated to 11.0.2
- Discovery of controllers and actions
- `Action<LiteApi.LiteApiOptions>` override for middleware registration

Only `netstandard2.0` and newer are supported in this release.
Attributes are now moved to root `LiteApi` namespace for easier discovery. Now
users don't have to *use* `LiteApi.Attributes` namespace, that namespace no longer
exists. VS IntelliSense had problems with displaying XML documentation (there was none in assemblies),
this is fixed now. Also `Json.NET` reference is updated to 11.0.2. Override
of `IApplicationBuilder.UseLiteApi` now supports action on `LiteApiOptions` as
shown below in *Discovery*.

### Discovery

If enabled discovery is available on `/liteapi/info.json` path. Discovery
can be enabled in options during middleware registration:

```csharp
app.UseLiteApi(options =>
{
    options.SetDiscoveryEnabled(true);
});
```

Discovery will return JSON with info about all parameter types, actions and controllers.
It's planned for future releases to support `/liteapi/info.html` page which
will return HTML page with rendered discovery JSON document in more human-readable format.

### Upcoming features

- Soon:
  - Discovery HTML page as mentioned
  - Performance improvements with IL generation
- Not so soon:
  - OpenAPI support

