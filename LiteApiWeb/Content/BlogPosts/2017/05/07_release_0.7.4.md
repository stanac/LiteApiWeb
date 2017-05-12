---
Author: stanac
CreatedDate: 2017-05-07
Title: Release 0.7.4
RenderTitle: true
IsHtml: false
Id: release-0_7_4
RenderShort: True
---

LiteApi 0.7.4 is released

<!-- short end -->

**Changes**:
- `FromUrlAttribute` is now `FromQueryAttribute`
- `RestfulLinksAttribute` is now `RestfullAttribute`
- `Json.NET` dependency updated to 10.0.2

`FromUrl` wasn't very descriptive because route segments are also
part of the URL. It was confusing when to use `FromRoute` and when
`FromUrl`, now it should be more clear what's the difference between
the two optional attributes.

`Restful` somehow just made sense more than `RestfulLinks`. Links
are parts of the documents (e.g. HTML). Links are pointing to URLs 
so hopefully this change made sense.