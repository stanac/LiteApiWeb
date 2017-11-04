---
Author: stanac
CreatedDate: 2017-08-24
Title: Global filters
RenderTitle: false
IsHtml: false
Id: global-filters
ParentPageId: security
---

## Global filters

Global filters can be used to filter any request that matches any
controller/action. They are implementing same interface as filter attributes.
Which means same attributes you use on controller or action level
can be used on global level. This gives us an option to 
prevent access to the whole API on middleware level except for example on
`Login` action.

Here is sample from `Startup.Configure` method which uses `RequiresAuthenticationAttribute`
as global filter.

```csharp
var options = LiteApiOptions
    .Default
    .AddGlobalFilter(new LiteApi.Attributes.RequiresAuthenticationAttribute());
app.UseLiteApi(options);
```

Global filters can be added to `LiteApiOptions` by calling one or more of the following methods:

| Method | Parameter | Description |
| --- | --- | --- |
| AddGlobalFilter | IApiFilter filter | Adds global filter |
| AddGlobalFilter | IApiFilterAsync filter | Adds global filter |
| AddGlobalFilters | IEnumerable&lt;IApiFilter&gt; filters | Adds global filters |
| AddGlobalFilters | IEnumerable&lt;IApiFilterAsync&gt; filters | Adds global filters |

Now, since there is no way to access the API you need either an action that has
`SkipFiltersAttribute` for login, or a separate middleware for logging in 
users. Here is a sample of the action that will ignore global (and local) filters:

```csharp
[Restful]
public class AuthController: LiteController
{
    [HttpPost, SkipFilters]
    public Task LoginUser(LoginData loginData)
    {
        // ...
    }
}
```

---
Related pages:
- [Installing and configurating LiteApi](/docs/install-and-configure)
- [Authorization](/docs/authorization)