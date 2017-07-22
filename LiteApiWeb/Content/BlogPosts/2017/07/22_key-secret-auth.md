---
Author: stanac
CreatedDate: 2017-07-22
Title: LiteApi with key/secret auth
RenderTitle: true
IsHtml: false
Id: key-secret-auth
RenderShort: False
---

Describes how to setup LiteApi with API key/secret authentication.

<!-- short end -->

Here is a quick guide in response to a question how to setup LiteApi to use API key/secret authentication.
Code presented in this guide can be found on [GitHub](https://github.com/stanac/LiteApi-Samples).

Before starting please note that using key/secret pair to authenticate user is not fully secure, you should
not use this type of authentication with HTTP, but only with HTTPS. This is due to the fact that key/secret
(similar to username/password in basic auth) is transfered over the network in plain text if you are using HTTP.
General recommendation is to "hide" .NET Core app behind a reverse proxy (e.g. nginx) and setup HTTPS on 
the reverse proxy.

## Books API

For the sample we are going to create an API that is returning a list of books. First we need to setup empty
LiteApi project (as described on [Getting started page](/getting-started)). After that we need some sort of 
service to return list books. Here is a dummy implementation:

```csharp
/// <summary>
/// Dummy book model, should have relation to Author and use ISBN for public Id
/// </summary>
public class BookModel
{
    public Guid Id { get; set; }
    public string Author { get; set; }
    public string Title { get; set; }
    public int? PublishYear { get; set; }
}

public interface IBookStore
{
    BookModel GetById(Guid id);
    IEnumerable<BookModel> GetAll();
}

/// <summary>
/// Dummy implementation of book store, should be implemented using DB.
/// </summary>
public class DummyBookStore : IBookStore
{
    private readonly BookModel[] _books;

    public DummyBookStore()
    {
        _books = new [] {
            new BookModel
            {
                Id = Guid.Parse("c3b0c912-31c7-4fea-a95e-a5c6eee2757f"),
                Title = "Foundation",
                Author = "Isaac Asimov",
                PublishYear = 1951
            },
            new BookModel
            {
                Id = Guid.Parse("8a998de3-436a-4f16-b228-d9944066cde1"),
                Title = "Solaris",
                Author = "Stanislaw Lem",
                PublishYear = 1961
            },
            new BookModel
            {
                Id = Guid.Parse("d3e47929-2e7e-4adb-8142-f85ea72818b6"),
                Title = "Childhood's End",
                Author = "Arthur C. Clarke",
                PublishYear = 1953
            }
        };
    }

    public IEnumerable<BookModel> GetAll() => _books;

    public BookModel GetById(Guid id) => _books.FirstOrDefault(x => x.Id == id);
}
```

As we can see from the code above, we have `BookModel` that is representing some basic book info,
`IBookStore` which is fairly simple interface which defines a contract for our app to retrieve books 
and we have dummy implementation of the `IBookStore`. In real world you would probably use EntityFramework
or something similar to retrieve books from some permanent storage.

Now we need to register our `IBookStore` in the `Startup` class:

```csharp
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddSingleton<IBookStore, DummyBookStore>();
    }

    public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseLiteApi();

        app.Run(async context =>
        {
            context.Response.StatusCode = 404;
            await context.Response.WriteAsync("404 - NOT FOUND");
        });
    }
}
```

And for the end, we need to create a controller in order to expose our data.

```csharp
[Restful]
public class BooksController: LiteController
{
    private readonly IBookStore _bookStore;

    public BooksController(IBookStore bookStore)
    {
        _bookStore = bookStore ?? throw new ArgumentNullException(nameof(bookStore));
    }

    [ActionRoute("/{id}")]
    public BookModel GetById(Guid id) => _bookStore.GetById(id);
    
    public IEnumerable<BookModel> All() => _bookStore.GetAll();
```

Our `BooksController` is straightforward, it is just exposing methods from `IBookStore`. Ok, now 
we have the sample API application, it's time to add API key/secret authentication/authorization.

## API key/secret auth

Out of the box LiteApi does not support this kind of auth, however it's flexible enough to enable
you to write it yourself in a few lines of code.

First we need a store class which can validate users key/secret pairs. Here is a dumb in-memory 
implementation (in real life you would probably store those in database, and consider encrypting or
hashing the secret):

```csharp
public interface IApiKeySecretStore
{
    bool ValidateKeySecret(string key, string secret);
}

/// <summary>
/// Dummy implementation of key secret store. Should be implemented using DB or 
/// some other form of permanent storage.
/// </summary>
public class DummyApiKeySecretStore : IApiKeySecretStore
{
    private Dictionary<string, string> _keySecretPairs = new Dictionary<string, string>();

    public DummyApiKeySecretStore()
    {
        _keySecretPairs["key1"] = "secret1";
        _keySecretPairs["key2"] = "secret2";
        _keySecretPairs["key3"] = "secret3";
        _keySecretPairs["key4"] = "secret4";
    }

    public bool ValidateKeySecret(string key, string secret)
        => _keySecretPairs.ContainsKey(key) && _keySecretPairs[key] == secret;
}
```

As you can see, our store is holding key/secret pairs in memory, in real life, it would be
a database with management app that can perform CRUD operations on the store. Same as with
`IBookStore` we need to register the `IApiKeySecretStore` in `ConfigureServices` method
of `StartupClass`:

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddSingleton<IBookStore, DummyBookStore>();
    services.AddSingleton<IApiKeySecretStore, DummyApiKeySecretStore>();
}
```

Next step is to create an attribute filter that will read key and secret from request header
and validate them against the store.

```csharp
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class RequiresKeySecretAttribute : Attribute, IApiFilter
{
    public bool IgnoreSkipFilters { get; } = false;

    public ApiFilterRunResult ShouldContinue(HttpContext httpCtx)
    {
        string apiKey = httpCtx.Request.Headers["x-api-key"];
        string apiSecret = httpCtx.Request.Headers["x-api-secret"];
        if (string.IsNullOrWhiteSpace(apiKey) || string.IsNullOrWhiteSpace(apiSecret))
        {
            return ApiFilterRunResult.Unauthenticated;
        }

        IApiKeySecretStore store = httpCtx.RequestServices.GetService(typeof(IApiKeySecretStore)) as IApiKeySecretStore;
        if (!store.ValidateKeySecret(apiKey, apiSecret))
        {
            return ApiFilterRunResult.Unauthenticated;
        }

        return ApiFilterRunResult.Continue;
    }
}
```

`RequiresKeySecretAttribute` will try to get API key and API secret from `x-api-key` and 
`x-api-secret` headers and if they are there it will call `IApiKeySecretStore` to
validate them. 

Only thing left to do is to decorate our controller class with `RequiresKeySecretAttribute`:

```csharp
[Restful, RequiresKeySecret]
public class BooksController: LiteController
{
    private readonly IBookStore _bookStore;

    public BooksController(IBookStore bookStore)
    {
        _bookStore = bookStore ?? throw new ArgumentNullException(nameof(bookStore));
    }

    [ActionRoute("/{id}")]
    public BookModel GetById(Guid id) => _bookStore.GetById(id);
    
    public IEnumerable<BookModel> All() => _bookStore.GetAll();
}
```

**More info about custom authorization attributes can be found in [docs](/docs/custom-authorization).**

Here is a .gif demonstrating usage of this API with postman.

![test](/content/imgs/blog/2017-07-22/api-key-secret.gif)

