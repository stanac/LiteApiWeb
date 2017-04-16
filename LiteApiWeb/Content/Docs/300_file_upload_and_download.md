---
Author: stanac
CreatedDate: 2017-04-15
Title: Files upload and download
RenderTitle: false
IsHtml: false
Id: files-upload-and-download
---

# Uploading and downloading files

## File downloading

This feature is not a critical one but it's a nice to have. There is a workaround for 
downloading files. You could simply put file in `wwwroot` of your app and have static 
files middleware handle it, or you could use a separate middleware for downloading files, 
or even return files in `base64` format. In case of LiteApi there is an interface called 
`ILiteActionResult` and a method in `LiteController` called `FileDownload` which can
be used for sending files to client. There is nothing special about `FileDownload` method, 
except that it returns object that implements `ILiteActionResult`. You can write your
own class that implements `ILiteActionResult` and it would be handled differently than 
other action call results (it won't be serialized, but it will need to handle response on
it's own). 

Here is an action that returns file for download.
```csharp
[HttpGet]
public ILiteActionResult Download()
{
    byte[] data = Encoding.UTF8.GetBytes("hello from LiteApi"); // can be Stream or byte[]
    string contentType = "text/plain";
    string fileName = "hello.txt";

    return FileDownload(data, contentType, fileName);
}
```

One note on providing files this way for download: behind the scenes LiteApi is using `byte[]` to hold file content, so it would be best to avoid sending large files this way to the client. Depending on the hardware and load `FileDownlaod` method should probably be able to handle files up to few 100s of megabytes.

## File uploading

Same as for file download feature, this one has many workarounds, but somehow the middleware 
would be incomplete without file upload feature. Let's face it, most SPA apps needs to have 
file upload support, and in order to avoid workarounds LiteApi supports HTML form data only 
in case of file upload. Here is an action that supports reading files uploaded by HTML form:

```csharp
[HttpPost]
public async Task<long> Upload(FormFileCollection fileCollection)
{
    long bytesUploaded = 0;
    foreach (var file in fileCollection.Files)
    {
        using (Stream diskFileStream = new FileStream(file.FileName, FileMode.Create))
        {
            bytesUploaded += file.Length;
            await file.CopyToAsync(diskFileStream);
        }
    }

    return bytesUploaded;
}
```

In case of file upload, only one parameter from body is needed of type 
`FormFileCollection`, multiple parameters from route or query are supported in the 
same call. As it's name says it `FormFileCollection` supports multiple files, 
there is no parameter type that supports just one file, in case when client uploads 
just one file `FormFileCollection` will have just that one uploaded file.
