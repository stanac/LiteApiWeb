---
Author: stanac
CreatedDate: 2017-08-24
Title: Release 0.9.1
RenderTitle: true
IsHtml: false
Id: release-0_9_1
RenderShort: True
---

LiteApi 0.9.1 is released

<!-- short end -->

This is the first release not marked as beta, which means all the features
in this release are thoroughly tested and ready for prime-time. If you
are asking **why** this release is not 1.0.0, it's simply because
there are two simple features to be added and integration
tests are planned to be automated before releasing 1.0.0. That means 
next release will be 1.0.0.

This is also the first release that supports netstandard 2.0, nuget package
is packed in such way to support both 1.6 and 2.0 standard versions.

**New features**:
- Support for netstandard 2.0 (beside already supported netstandard 1.6)
- [Global filters](/docs/global-filters)
- [Ability to change API URL root from '/api/' to almost anything you want](/docs/changing-api-url-root)


**What's left?**
- Support for `System.DateTimeOffset`
- Support for specifying parsing formats of `System.DateTime` and `System.DateTimeOffset`
- Automation of integration tests

**Why not 0.9.0?**
- Package v0.9.0 had issue with not packing dll for netstandard 2.0. 
v0.9.1 was published to support both 1.6 and 2.0 versions of the standard.