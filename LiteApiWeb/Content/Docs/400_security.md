---
Author: stanac
CreatedDate: 2017-04-15
Title: Security
RenderTitle: false
IsHtml: false
Id: security
---

# Security

LiteApi handles authorization and require HTTPS options. Authentication is handled
by other middlewares. For example of integrating cookie based authentication with LiteApi
check [sample on GitHub](https://github.com/stanac/LiteApi/tree/master/LiteApi/LiteApi.AuthSample).

## Require HTTPS

Require HTTPS can be set on controller level, action level or middleware level by
using `LiteApi.Attributes.RequiresHttpsAttribute` or by setting `LiteApiOptions`
when registering middleware.
For more information please check [Require HTTPS](/docs/require-https).

## Authorization

Authorization is done with `Requires...Attribute` on controller or action level.
For more information please check [Authorization](/docs/authorization).
Authorization can be implemented on middleware level using 
[Global filters (to be implemented)](/docs/global-filters).