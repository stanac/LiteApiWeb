---
Author: stanac
CreatedDate: 2017-07-22
Title: Custom headers, status and response
RenderTitle: false
IsHtml: false
Id: custom-response
---

# Custom status, headers and response

Since release 0.8 it's possible to return any type of response from action with
any custom content, response code, and header.
This is done by using following methods available in any controller:
 - <code>ILiteActionResult Content(string data, string contentType)</code>
 - <code>ILiteActionResult Content(byte[] data, string contentType)</code> 
 - <code>ILiteActionResult Json(string jsonContent)</code>
 - <code>void SetResponseStatusCode(int? responseCode)</code>
 - <code>void AddResponseHeader(string key, StringValues values)</code>
 - <code>void AddResponseHeaders(IDictionary<string, StringValues> keyValuesPairs)</code>

See following sample action:

```csharp
public class SomeController: LiteController
{
    public ILiteActionResult SomeResponse()
    {
        AddResponseHeader("key", "val");
        SetResponseStatusCode(241);
        return Json("{ \"a\": \"b\" }");
        // or
        // return Content("response body", "text/plain");
    }
}
```
