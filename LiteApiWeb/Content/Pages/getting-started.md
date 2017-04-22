---
Author: stanac
CreatedDate: 2017-04-11
Tags: home welcome initial
Title: none
RenderTitle: false
IsHtml: false
---

# Getting started

<div class='alert alert-info'>
tl;dr here is the code on GitHub.
</div>

<div class='alert alert-info'>
If you have never worked with MVC types of server side frameworks/middlwares 
you might want to check <a href="/docs/basic-concepts">Basic concepts</a>.
</div>


## Tools

We are going to use free version of Visual Studio 2017, [Community edition](https://www.visualstudio.com/thank-you-downloading-visual-studio/?sku=Community).
If you are no using Windows, you can try free code editor [VS Code](https://code.visualstudio.com/download).

## Setup

### Create new project

Select new project in Visual Studio, choose Visual C# -> .NET Core -> ASP.NET Core Web Application.
If you are using VS Core (or some other code editor) you can use [dotnet CLI](https://docs.microsoft.com/en-us/dotnet/articles/core/tools/dotnet-new), but this article won't
cover any details about using CLI tool (there will be another article).

<div class='col-md-12 text-center'>
<img src="/content/imgs/getting-started/01_new_project.png" />
</div>

On next screen select empty project and click OK.

<div class='col-md-12 text-center'>
<img src="/content/imgs/getting-started/02_empty_project.png" />
</div>

<div style='clear:both'> <br/> </div>

### Install nuget package

Once the project is created go to solution explorer (if not visible VIEW -> Solution Explorer) right click on 
dependencies and select Manage Nuget Packages.

<div class='col-md-12 text-center'>
<img src="/content/imgs/getting-started/03_manage_nugets.png" />
</div>

In Package explorer go to *Browse*, check *Include prerelease*, search for *LiteApi*, and install the package.

<div class='col-md-12 text-center'>
<img src="/content/imgs/getting-started/04_install_lite_api.png" />
</div>

<div style='clear:both'> <br/> </div>

### Setup middleware

In `Startup.cs` file in `Configure` method add `app.UseLiteApi()` as in the sample:

```csharp
public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
{
    loggerFactory.AddConsole();

    if (env.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
    }

    app.UseLiteApi();
    
    app.Run(async (context) =>
    {
        await context.Response.WriteAsync("Hello World!");
    });
}
```

<div class='alert alert-info'>
At this point Visual Studio IntelliSense didn't recognize LiteApi namespace, or app.UseLiteApi(); I had to
restart VS in order for IntelliSense to wake up.
</div>

<div style='clear:both'> <br/> </div>


## Create simple controller

Create a folder in your project called `API` or `Controller` or whatever makes sense to you and add
create new class called *MathController* in the folder. For this sample we will use API folder.

At the top of the file add `using LiteApi;` statement, and set your class to inherit `LiteController`.

```csharp
using LiteApi;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GettingStarted.API
{
    public class MathController: LiteController
    {
    }
}
```

Now we have a controller without any action.

### Add some actions

We will add actions that will add two integers, subtract two integers and sum array of integers.

In order to create action that will add two integers we can write a method that accepts `int a` and `int b`
parameters and returns `a + b`;

```csharp
public class MathController: LiteController
{
    public int Add(int a, int b) => a + b;
}
```

By default all public methods will respond to `HTTP GET`. So we don't need any other code to invoke
our API.

For testing the API we will use [Postman](https://www.getpostman.com/). Start your project. A browser should
open with words *Hello World!*. *Hello World!* is returned by sample middleware that was added during
project creation. Copy the URL from browser, we are going to need it for testing the API in Postman.

Now, open Postman and paste URL from the browser and invoke `GET` request. 
You should get something like this:

<div class='col-md-12 text-center'>
<img src="/content/imgs/getting-started/05_postman_hello_world.png" />
</div>

Ok, now set the URL to point to our action. In order to target the action from our controller, URL
should be in following format:

```
/api/{controller}/{action}?param1=value1&param2=value2
```

In our case it should be `/api/math/add?a=2&b=3`. If we send the `GET` request through Postman
we should get 5 for response as on the following screenshot.

<div class='col-md-12 text-center'>
<img src="/content/imgs/getting-started/06_postman_add.png" />
</div>

For subtraction action we want to use different format of the URL. When we invoke `/api/math/5/minus/3` we 
want to get `2` as the response. In order to achiveachieve such behavior we will use `ActionRouteAttribute` from
`LiteApi.Attributes` namespace.

After adding `Minus` action, our file looks like this:

```csharp
using LiteApi;
using LiteApi.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GettingStarted.API
{
    public class MathController: LiteController
    {
        public int Add(int a, int b) => a + b;

        [ActionRoute("/{a}/minus/{b}")]
        public int Minus(int a, int b) => a - b;
    }
}
```

In the `Minus` action parameter names from attribute and method must be matched by name. LiteApi will
try to automatically recognize from where parameter should be retrieved. If there is a parameter in action
route with same name as in the method, LiteApi will expect for the parameter to arrive as URL segment.

After invoking the `GET` method in Postman response should be returned.

<div class='col-md-12 text-center'>
<img src="/content/imgs/getting-started/07_postman_subtract.png" />
</div>

Sum action is left to be implemented. This action should accept array of integers (or `List<int>` or IEnumerable<int>)
and return sum of all integers from the collection. In order to pass a collection we should repeat 
parameter in the query string. Sum action will respond on `/api/math/sum?ints=1&ints=4&ints=2`.

Here is the controller after adding `Sum` method and below the code is response in Postman.

```csharp
public class MathController: LiteController
{
    public int Add(int a, int b) => a + b;

    [ActionRoute("/{a}/minus/{b}")]
    public int Minus(int a, int b) => a - b;

    public int Sum(int[] ints) => ints.Sum();
}
```

<div class='col-md-12 text-center'>
<img src="/content/imgs/getting-started/08_postman_sum.png" />
</div>

<div style='clear:both'> <br/> </div>

## Create RESTful controller

For the following example we plan to create RESTful controller that will get all actors, 
get actor by Id, add actor, update an actor by Id, and delete an actor by Id. Furthermore we
will be building RESTful API, which means action names are not allowed in URLs.

### Adding model and service

Our `ActorModel` looks like this.

```csharp
public class ActorModel
{
    public Guid Id { get; set; }

    public string Name { get; set; }

    public int BirthYear { get; set; }
}
```

We need some sort of permanent storage for actors, but fake `IDictionary<Guid, ActorModel>` will
do the job.

Here is the interface our service will implement:

```csharp
public interface IActorsService
{
    IEnumerable<ActorModel> GetAll();
    ActorModel Get(Guid id);
    ActorModel Add(ActorModel model);
    ActorModel Update(Guid id, ActorModel model);
    bool Delete(Guid id);
}
```

and here is the service:

```csharp
public class ActorsService : IActorsService
{
    private static readonly IDictionary<Guid, ActorModel> _data = new ConcurrentDictionary<Guid, ActorModel>();

    public ActorModel Add(ActorModel model)
    {
        if (model.Id == Guid.Empty) model.Id = Guid.NewGuid();
        _data[model.Id] = model;
        return model;
    }

    public bool Delete(Guid id)
    {
        if (_data.ContainsKey(id))
        {
            _data.Remove(id);
            return true;
        }
        return false;
    }

    public ActorModel Get(Guid id)
    {
        if (_data.ContainsKey(id)) return _data[id];
        return null;
    }

    public IEnumerable<ActorModel> GetAll() => _data.Select(x => x.Value);

    public ActorModel Update(Guid id, ActorModel model)
    {
        model.Id = id;
        _data[id] = model;
        return model;
    }
}
```

Our service needs to be registered in `Startup.cs` file, in `ConfigureServices` method.

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddScoped<IActorsService, ActorsService>();
}
```

### Adding the controller

Lets say our controller is second version of the API. In such case we can use `ControllerRouteAttribute`
from `LiteApi.Attributes` namespace with appropriate route. If we want our actions to response to URLs 
without action names we should use `RestfulLinksAttribute`. Here is our controller which uses the
service we described above.

```csharp
// RestfulLinks will tell LiteApi to ignore action names when matching URL to action, 
// ControllerRoute will tell LiteApi to use specified path to target the controller
[RestfulLinks, ControllerRoute("/api/v2/actors")] 
public class ActorsController : LiteController, IActorsService
{
    private readonly IActorsService _service;

    public ActorsController(IActorsService service)
    {
        _service = service;
    }

    [HttpPost] // will respond to POST /api/v2/actors
    public ActorModel Add(ActorModel model) => _service.Add(model);

    [HttpDelete, ActionRoute("/{id}")] // will respond to DELETE /api/v2/actors/{id}
    public bool Delete(Guid id) => _service.Delete(id);

    [HttpGet, ActionRoute("/{id}")] // HttpGet is optional, will respond to GET /api/v2/actors/{id}
    public ActorModel Get(Guid id) => _service.Get(id);

    [HttpGet] // HttpGet is optional, will respond to GET /api/v2/actors
    public IEnumerable<ActorModel> GetAll() => _service.GetAll();

    [HttpPut, ActionRoute("/{id}")] // will respond to PUT /api/v2/actors/{id}
    public ActorModel Update(Guid id, ActorModel model) => _service.Update(id, model);
}
```

Few remarks on this controller:
 - `RestfulLinks` will tell LiteApi to ignore action names when matching the URL to controller/action
 - `ControllerRoute` can be used to alter the route of the controller
 - Following HTTP methods are supported: `GET`, `POST`, `PUT`, `DELETE`, more are coming in future releases
 - `HttpGet` attribute is optional
 - Complex models, eg. `ActorModel` must be passed using HTTP request body
 - `ActionRoute` can be used to tell LiteApi to retrieve parameter value from route segment

### Testing the controller

Here is a gif which demonstrates how to use `ActorsController`:

<div class='col-md-12 text-center'>
<img src="/content/imgs/getting-started/09_actors.gif" />
</div>


<div style='clear:both'> <br/> </div>

<div class='alert alert-info'>
Here is the code on GitHub. Documentation can be found under <a href="/docs">Docs section</a>.
</div>
