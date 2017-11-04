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
    public ILiteActionResult FileDownload(byte[] data, string contentType, string fileName) => new FileDownloadActionResult(data, contentType, fileName);

    /// <summary>
    /// Write response of file download. Provided Stream will not be disposed, you need to do it yourself.
    /// </summary>
    /// <param name="data">The data to download.</param>
    /// <param name="contentType">Content type header value.</param>
    /// <param name="fileName">Name of the file.</param>
    /// <returns>Result that can be handled by the middleware.</returns>
    public ILiteActionResult FileDownload(Stream data, string contentType, string fileName) => new FileDownloadActionResult(data, contentType, fileName);

    /// <summary>
    /// Creates response with the specified data.
    /// </summary>
    /// <param name="data">The data.</param>
    /// <param name="contentType">Type of the content.</param>
    /// <returns>Result that can be handled by the middleware.</returns>
    public ILiteActionResult Content(string data, string contentType) => new ContentActionResult(data, contentType);

    /// <summary>
    /// Creates response with the specified data.
    /// </summary>
    /// <param name="data">The data.</param>
    /// <param name="contentType">Type of the content.</param>
    /// <returns>Result that can be handled by the middleware.</returns>
    public ILiteActionResult Content(byte[] data, string contentType) => new ContentActionResult(data, contentType);

    /// <summary>
    /// Creates response with the specified JSON content.
    /// </summary>
    /// <param name="jsonContent">Content in JSON format.</param>
    /// <returns>Result that can be handled by the middleware.</returns>
    public ILiteActionResult Json(string jsonContent) => new JsonActionResult(jsonContent);

    /// <summary>
    /// Sets the response status code.
    /// </summary>
    /// <param name="responseCode">The response status code, if null or not set LiteApi will determine by itself response status code.</param>
    public void SetResponseStatusCode(int? responseCode)
    {
        HttpContext.SetResponseStatusCode(responseCode);
    }

    /// <summary>
    /// Adds the response header.
    /// </summary>
    /// <param name="key">The header key.</param>
    /// <param name="values">The header value(s).</param>
    public void AddResponseHeader(string key, StringValues values)
    {
        var headers = HttpContext.GetResponseHeaders(false);
        headers.Add(key, values);
    }

    /// <summary>
    /// Adds the response headers.
    /// </summary>
    /// <param name="keyValuesPairs">The key values pairs to add.</param>
    public void AddResponseHeaders(IDictionary<string, StringValues> keyValuesPairs)
    {
        var headers = HttpContext.GetResponseHeaders(false);
        foreach (var kvp in keyValuesPairs)
        {
            headers[kvp.Key] = kvp.Value;
        }
    }
    
    /// <summary>
    /// Returns a <see cref="System.String" /> that represents this instance.
    /// </summary>
    /// <returns>
    /// A <see cref="System.String" /> that represents this instance.
    /// </returns>
    public override string ToString() => "CTRL: " + GetType().FullName;

    /// <summary>
    /// Called before action execution. Should return bool value indicating whether action should be executed. 
    /// </summary>
    /// <param name="ctx">Action executing context.</param>
    /// <returns>Task with bool result. If task result is true action will be executed.</returns>
    [Attributes.DontMapToApiAttribute]
    public virtual Task<bool> BeforeActionExecution(ActionExecutingContext ctx)
    {
        return Task.FromResult(true);
    }

    /// <summary>
    /// Called after the action is executed.
    /// </summary>
    /// <param name="ctx">Action executing context.</param>
    /// <param name="result">Result of action call.</param>
    /// <returns>Task to await.</returns>
    [Attributes.DontMapToApiAttribute]
    public virtual Task AfterActionExecuted(ActionExecutingContext ctx, object result)
    {
        return Task.FromResult(0);
    }
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
how to write the response itself. Internally it's used for file download, returning 
raw json or returning custom responses, however
it can be implemented by any class, so low-level response can be handled by
class that's specific to your application.

There are specialized methods that are returning `ILiteActionResult`, see [Custom status, headers and response](/docs/custom-response).

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
