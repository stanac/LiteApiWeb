---
Author: stanac
CreatedDate: 2017-04-15
Title: Action matching
RenderTitle: false
IsHtml: false
Id: action-matching
ParentPageId: controller-and-action-matching
---

# Action matching


<div class="alert alert-info">
All attributes used in samples are located in <code>LiteApi.Attributes</code> namespace. All routes and parameters are case insensitive.
</div>

Actions are by default matched by HTTP method and action name.

## Matching by URL

```csharp
public class PersonsController: LiteController
{
    // responds to GET /api/persons/get?id=5
    public PersonModel Get(int id) => _service.Get(id);
}
```
---

Action name can be overridden using `LiteApi.Attributes.ActionRouteAttribute`.

```csharp
public class PersonsController: LiteController
{
    // responds to GET /api/persons/getperson?id=5
    [ActionRoute("GetPerson")]
    public PersonModel Get(int id) => _service.Get(id);
}
```

---

Action name can be omitted in case when `LiteApi.Attributes.RestfulLinks` is set on controller.

```csharp
[RestfulLinks]
public class PersonsController: LiteController
{
    // responds to GET /api/persons?id=5
    public PersonModel Get(int id) => _service.Get(id);
}
```

---

By combining `RestfulLinksAttribute` and `ActionRouteAttribute` it's possible to get action to respond to RESTful URL: `/api/persons/{id}`.

```csharp
[RestfulLinks]
public class PersonsController: LiteController
{
    // responds to GET /api/persons/5
    [ActionRoute("/{id}")]
    public PersonModel Get(int id) => _service.Get(id);
}
```

More about route segment parameters can be found on [dedicated page](/#/docs/parameter-retrieving-from-route-segment).

---

## Action matching by HTTP method

In all examples above actions are responding to HTTP `GET` methods. By default if method is public it's 
considered to be HTTP `GET` method. We can explicitly set which method our action should respond to.

```csharp
[RestfulLinks]
public class PersonsController: LiteController
{
    // responds to GET /api/persons/5
    [HttpGet, ActionRoute("/{id}")]
    public PersonModel Get(int id) => _service.Get(id);

    // responds to PUT /api/persons/5
    [HttpPut, ActionRoute("/{id}")]
    public PersonModel Update(int id, PersonModel model) => _service.Update(id, model);
}
```

Only one Http<em>Method</em>Attribute can be set on one action.

Following HTTP methods are supported with attributes:
- `LiteApi.Attributes.HttpGet`
- `LiteApi.Attributes.HttpPost`
- `LiteApi.Attributes.HttpPut`
- `LiteApi.Attributes.HttpDelete`

More HTTP methods might be supported in future releases (if you need `PATCH` or some other method to be 
added please open ticket on [GitHub](https://github.com/stanac/shutdown/issues/new).

---

## Void and async actions

Actions can return `void`, they can be `async`, return `Task`s and generic `Task<T>`. It's considered bad practice to use
`async void` return type. If something like that is needed please use `async Task` methods. Of course
actions can return any complex or primitive type you like.


Task can be awaited but they don't have to, you can simply return a task and LiteApi will await it. Some samples:

```csharp
[RestfulLinks]
public class PersonsController: LiteController
{
    // responds to GET /api/persons/5
    [ActionRoute("/{id}")]
    public async Task<PersonModel> Get(int id)
    {
        PersonDto person = await _service.GetAsync(id);
        return person.ToModel();
    }

    // responds to GET /api/persons
    // LiteApi will await the result for you, you don't have to explicitly await the task
    public Task<IEnumerable<PersonModel>> GetAll() => _service.GetAllAsModelsAsync();
}
```

---

## DontMapToApiAttribute

Since all public methods are considered to be `GET` actions, sometimes we want to avoid mapping a
public method to API. This might be important especially when we have a public method that is 
accepting complex parameter. All complex parameters are implicitly considered to come from body, which is
not allowed in `GET` methods, in such case LiteApi will throw exception during startup and application will
not be able to start.

This code sample will throw exception.

```csharp
public class PersonController: LiteController
{
    // ctor and other init code
    
    public Person Get(int id) => Convert(_service.Get(id));

    public PersonModel Convert(PersonDto person)
    {
       // code for converting PersonDto to PersonModel
    }
}
```

And this one won't.

```csharp
public class PersonController: LiteController
{
    // ctor and other init code
    
    public Person Get(int id) => Convert(_service.Get(id));

    [DontMapToApi]
    public PersonModel Convert(PersonDto person)
    {
       // code for converting PersonDto to PersonModel
    }
}
```