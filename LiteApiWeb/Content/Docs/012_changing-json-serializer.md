---
Author: stanac
CreatedDate: 2017-03-30
Title: Changing JSON serializer
RenderTitle: false
IsHtml: false
Id: changing-json-serializer
ParentPageId: install-and-configure
---

# Changing JSON serializer

By default LiteApi is using Json.NET de/serializer. It's possible to configure it or to
change it to suit your needs.

LiteApi has interface called 
[LiteApi.Contracts.Abstractions.IJsonSerializer](https://github.com/stanac/LiteApi/blob/master/LiteApi/LiteApi/Contracts/Abstractions/IJsonSerializer.cs) 
which has following defined:

```csharp
public interface IJsonSerializer
{
    T Deserialize<T>(string json);
    object Deserialize(string json, Type objectType);
    string Serialize(object obj);
}
```

Defualt IJsonSerializer looks like this:

```csharp
internal class JsonSerializer : IJsonSerializer
{
    private static JsonSerializerSettings _settings = new JsonSerializerSettings
    {
        ContractResolver = new CamelCasePropertyNamesContractResolver(),
        PreserveReferencesHandling = PreserveReferencesHandling.None,
        ReferenceLoopHandling = ReferenceLoopHandling.Ignore
    };

    public object Deserialize(string json, Type objectType) => JsonConvert.DeserializeObject(json, objectType, _settings);

    public T Deserialize<T>(string json) => JsonConvert.DeserializeObject<T>(json, _settings);

    public string Serialize(object obj) => JsonConvert.SerializeObject(obj, _settings);
}
```

You can provide your own configuration for Json.NET by implementing `IJsonSerializer`
or you can change serializer to use some different libarary.

In order to change serializer `LiteApiOptions` needs to be changed and used when
registering the middleware in `Startup` class:

```csharp
// myJsonSerializer needs to implement LiteApi.Contracts.Abstractions.IJsonSerializer
var options = LiteApiOptions.Default
    .SetJsonSerializer(myJsonSerializer);
app.UseLiteApi(options);
```