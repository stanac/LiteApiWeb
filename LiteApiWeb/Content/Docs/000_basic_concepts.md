---
Author: stanac
CreatedDate: 2017-03-30
Title: Basic concepts
RenderTitle: false
IsHtml: false
Id: basic-concepts
---

# Basic concepts

<div class='alert alert-info'>
If you are already familiar with basic concepts of server side MVC frameworks/middlewares
you might want to check <a href="/#/getting-started">Getting started</a>.
</div>

LiteApi is .NET Core middleware for creating Web APIs. It follows MVC pattern but does not
support views.

Controller is a class that should handle requests for one type of resources, for example books.
BookController should be able to retrieve books (by id, page, category, etc...), 
and optionally create/update/delete books. Each URL and HTTP method
should respond to a single action in controller.

## Basic conventions

Controllers are usually located in `Controllers` or `API` directory and namespace,
but that's not necessary. Controller can be split by your own preferences, for example you can set your controllers in folders like this:
- Admin
- Public
- Reports
- ApiVersion2
- any folder you desire

Each public method is considered to be HTTP `GET` action. And each parameter in the method is considered
to be from query or route segment (check [Controller and action matching](/#/docs/controller-and-action-matching) and [Parameter retrieving](/#/docs/parameter-retrieving) for information).

