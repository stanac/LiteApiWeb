---
Author: stanac
CreatedDate: 2017-05-02
Title: LiteController and ILiteActionResult
RenderTitle: false
IsHtml: false
ParentPageId: basic-concepts
Id: litecontroller-and-iliteactionresult
---

# LiteController

`LiteApi.LiteController` is abstract class which all controllers
in LiteApi app must inherit. If something needs to be done on lower level with
request it can be done using `HttpContext` property provided by `LiteController`.

`LiteController` is very lite class (pun intended).

```csharp
/// <summary>
/// Base class for all controllers that should be registered by the middleware
/// </summary>
public abstract class LiteController
{
    /// <summary>
    /// Gets the HTTP context.
    /// </summary>
    /// <value>
    /// The HTTP context.
    /// </value>>
    public HttpContext HttpContext { get; internal set; }

    /// <summary>
    /// Gets the user.
    /// </summary>
    /// <value>
    /// The user.
    /// </value>
    public ClaimsPrincipal User => HttpContext?.User;

    /// <summary>
    /// Writes response of file download.
    /// </summary>
    /// <param name="data">The data to download.</param>
    /// <param name="contentType">Content type header value.</param>
    /// <param name="fileName">Name of the file.</param>
    /// <returns>Result that can be handled by the middleware.</returns>
    public ILiteActionResult FileDownload(byte[] data, string contentType, string fileName)
    {
        return new FileDownloadActionResult(data, contentType, fileName);
    }

    /// <summary>
    /// Write response of file download. Provided Stream will not be disposed, you need to do it yourself.
    /// </summary>
    /// <param name="data">The data to download.</param>
    /// <param name="contentType">Content type header value.</param>
    /// <param name="fileName">Name of the file.</param>
    /// <returns>Result that can be handled by the middleware.</returns>
    public ILiteActionResult FileDownload(Stream data, string contentType, string fileName)
    {
        return new FileDownloadActionResult(data, contentType, fileName);
    }

    /// <summary>
    /// Returns a <see cref="System.String" /> that represents this instance.
    /// </summary>
    /// <returns>
    /// A <see cref="System.String" /> that represents this instance.
    /// </returns>
    public override string ToString() => "CTRL: " + GetType().FullName;
}
```

Return value of actions in your controllers needs to be:
- `Task`
- `Task<T>`
- `void` (not recommended for `async` calls)
- `T` (any other value)

Actions can be `async` but does not have to be.

# ILiteActionResult

`LiteApi.ILiteActionResult` is special type of action response that will not 
be serialized by the middleware. Instead `ILiteActionResult` needs to know
how to write the response itself. Internally it's used for file download, but
it can be inherited by any class, so low-level response can be handled by
class that's specific to your application.

Content of `ILiteActionResult` interface:

```csharp
/// <summary>
/// Specialized type of response that does not need to be serialized, but instead can write the response itself
/// </summary>
public interface ILiteActionResult
{
    /// <summary>
    /// Writes the response.
    /// </summary>
    /// <param name="httpCtx">The HTTP context.</param>
    /// <param name="actionCtx">The action context.</param>
    /// <returns>Task to await</returns>
    Task WriteResponse(HttpContext httpCtx, ActionContext actionCtx);
}
```