---
Author: stanac
CreatedDate: 2017-03-30
Title: Configurating logging
RenderTitle: false
IsHtml: false
Id: configurating-logging
ParentPageId: install-and-configure
---

# Configurating logging

LiteApi by default does not log anything, but is capable of logging
`Information` and `Error` log entries. In order to enable logging, LoggerFactory
needs to be set during registration of the middleware in `Startup`.

```csharp
public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
{
    loggerFactory.AddConsole();

    // ... other middlewares

    var options = LiteApiOptions.Default
        .SetLoggerFactory(loggerFactory);

    app.UseLiteApi(options);

    // ... other middlewares
}
```