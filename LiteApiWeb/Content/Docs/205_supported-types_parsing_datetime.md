---
Author: stanac
CreatedDate: 2017-11-02
Title: Parsing DateTime and DateTimeOffset parameters
RenderTitle: false
IsHtml: false
Id: parameters-parsing-datetime-and-datetimeoffset
ParentPageId: parameters-supported-types
---

# Parsing DateTime and DateTimeOffset parameters

Value of `DateTime` and `DateTimeOffset` types can be passed as 
URI segment, query value, header value and body. 

## Parsing DateTimeOffset

Since `DateTimeOffset`
is very specific (includes timezone) specifying
exact parsing format for `DateTimeOffset` isn't supported. It's recommended
for value passed as `DateTimeOffset` to be in following format:

```
2017-10-28T09:51:17+07:00 (which is percent encoded 2017-10-28T09:51:17%2B07:00)
```

## Parsing DateTime

### Specifying IFormatProvider

For parsing `DateTime` exact format and `IFormatProvider` can be specified.
`IFormatProvider` is specified with `DateTimeParsingFormatProviderFactory` which
is located in `LiteApiOptions`. Default implementation of 
`DateTimeParsingFormatProviderFactory` is:

```csharp
// LiteApiOptions

public Func<HttpContext, IFormatProvider> DateTimeParsingFormatProviderFactory { get; private set; }
    = httpCtx => System.Globalization.CultureInfo.CurrentCulture;
```

If it's desired to change default `DateTimeParsingFormatProviderFactory` it can be
done using `LiteApiOptions.SetDateTimeParsingFormatProviderFactory` as in:

```csharp
// Startup.cs method: Configure

LiteApiOptions options = LiteApiOptions.Default
    .SetDateTimeParsingFormatProviderFactory(myProviderFact);
app.UseLiteApi(options);
```

### Specifying parsing format

It's possible to specify exact parsing format on:
 - Middleware level
 - Controller level
 - Action level

When parsing `DateTime` LiteApi will check if parsing format exists on
action, if not it will look for paring format on controller and if neither
exist, it will use global parsing format (format specified on middleware level).

Global parsing format is set with `LiteApiOptions.SetGlobalDateTimeParsingFormat(string)`.
Default value is null, which means `DateTime.Parse(string)` method will be used
which will try to determine the format on it's own.

Let's check an example:

```csharp
[DateTimeParsingFormat("MM/dd/yyyy")]
public class Dt1Controller: LiteController
{
    public long Ticks1(DateTime dt)
    {
        return dt.Ticks;
    }

    [DateTimeParsingFormat("yyyy-MM-dd")]
    public long Ticks2(DateTime dt)
    {
        return dt.Ticks;
    }
}
```

In the `Dt1Controller` action `Ticks1` will use parsing format
specified on controller level (`"MM/dd/yyyy"`) and `Ticks2` will
use format specified on the action (`"yyyy-MM-dd"`). If `Dt1Controller`
didn't have specified parsing format global parsing format would be used.
Global parsing format can be specified when registering LiteApi in `Startup.cs`:

```csharp
// Startup.cs method: Configure

LiteApiOptions options = LiteApiOptions.Default
    .SetGlobalDateTimeParsingFormat("yyyy-MM-dd")
app.UseLiteApi(options);
```

**Note**: it's not possible to specify parsing format on parameter level.
If you really need ASAP, please raise an issue 
[here](https://github.com/stanac/LiteApi/issues).