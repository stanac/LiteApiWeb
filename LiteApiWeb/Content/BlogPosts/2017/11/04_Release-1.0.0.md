---
Author: stanac
CreatedDate: 2017-11-04
Title: 1.0.0 is available
RenderTitle: true
IsHtml: false
Id: release-1.0.0
RenderShort: False
---

LiteApi 1.0.0 is released

<!-- short end -->

LiteApi 1.0.0 is available on [Nuget](https://www.nuget.org/packages/LiteApi/).

## What's new
Beside significant version number, here are new features:
- Support for `DateTimeOffset` ([Link](/parameters-parsing-datetime-and-datetimeoffset))
- Support for choosing parsing format of `DateTime` ([Link](/parameters-parsing-datetime-and-datetimeoffset))
- Support for working with enum parameters ([Link](/docs/parameters-enums))

## More importantly, what's next?

Next version (v1.1) will add support for generating OpenAPI JSON specification.
LiteApi will support v2 of the specification. Even though v3 is the latest version,
we are targeting v2 because most of the tools in the wild support v2. Somewhere during
2018 we will add support for v3 specification, once v3 tooling become more available.

After v1.1 plan is to support SwaggerUI out of the box (possibly in version #1.1.1).
Release v1.2 will focus on performance improvements.

For more detailed roadmap please check [this GitHub page](https://github.com/stanac/LiteApi/blob/master/roadmap.md).

<div class="alert alert-info">
Do you have any feature requests? Anything that should be added to the documentation?
Please create a ticket on <a href="https://github.com/stanac/LiteApi/issues">GitHub</a>.
</div>