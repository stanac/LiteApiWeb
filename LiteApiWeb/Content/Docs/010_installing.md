---
Author: stanac
CreatedDate: 2017-03-30
Title: Installing and configurating
RenderTitle: false
IsHtml: false
Id: install-and-configure
---

# Installing and configurating LiteApi

## Installing

LiteApi is published on [nuget.org](https://www.nuget.org/packages/LiteApi/).
You can add it to your project
using Visual Studio (check [getting started](/getting-started))
or by editing project's `.csproj` file and running [dotnet-restore](https://docs.microsoft.com/en-us/dotnet/articles/core/tools/dotnet-restore) command.

```xml
<ItemGroup>
  <PackageReference Include="LiteApi" Version="0.7.2-beta" />
  <!-- more packages ... -->
<ItemGroup>
```

## Configurating

Once the package is installed, you can add middleware in `Startup` class,
`Configure` method.

Simplest way to add middleware is without any configuration:

```csharp
app.UseLiteApi();
```

Equivalent would be to use default options:

```csharp
app.UseLiteApi(LiteApiOptions.Default);
```

Options can be set with fluid methods, eg:

```csharp
app.UseLiteApi(LiteApiOptions.Default
    .AddAdditionalQueryModelBinder(myQueryModelBinder)
    .SetLoggerFactory(myLoggerFact)
    );
```

Following methods can alter `LiteApiOptions`:

| Method | Parameter | Description | Link |
| --- | --- | --- |
| AddAdditionalQueryModelBinder | IQueryModelBinder binder | Sets additional query model binder, by default LiteApi is using binder for basic types, arrays/lists/enumerables and dictionaries | [Link](/docs/custom-parameter-provider) |
| AddAuthorizationPolicy | string name, Func<ClaimsPrincipal, bool> policy | Defines authorization policy that can be used to filter access to controllers and actions | [Link](/docs/policy-authorization) |
| AddControllerAssemblies | IEnumerable&lt;Assembly&gt; controllerAssemblies | Adds additional assemblies in which LiteApi should look for controller. By default LiteApi check calling assembly for controllers | [Link](/docs/controller-registration) |
| SetJsonSerializer | IJsonSerializer jsonSerializer | Sets custom JSON (de)serializer, by default Json.NET is used | [Link](/docs/changing-json-serializer) |
| SetLoggerFactory | ILoggerFactory loggerFactory | Sets logger factory, no logger is used by default | [Link](/docs/configurating-logging) |
| SetRequiresHttps | bool requireHttps | Tells middleware to (or not to) reject all non HTTPS requests | [Link](/docs/require-https) |

Method that is planned to be added is `SetApiRootUrl(string rootUrl)`.
By default all controller root URLs are `/api` which can be overriden with `ControllerRouteAttribute`.
