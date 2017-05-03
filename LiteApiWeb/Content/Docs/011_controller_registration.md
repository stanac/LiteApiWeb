---
Author: stanac
CreatedDate: 2017-03-30
Title: Controller registration
RenderTitle: false
IsHtml: false
Id: controller-registration
ParentPageId: install-and-configure
---

# Controller registration

For your class to be recognized as a controller it needs to inherit `LiteApi.LiteController`
class.

All classes that inherit mentioned base class and are located in your web application assembly
are registered by default. If you want to add additional controllers that are located in
different assemblies you can do that in `Startup` class in `Configure` method
by changing default options.

```csharp
var options = LiteApiOptions.Default.AddControllerAssemblies(
    new System.Reflection.Assembly[] { ctrlAssembly1, ctrlAssembly2 }
    );
app.UseLiteApi(options);
```

## Constructor

Controller constructor can accept parameters of types that are registered with
DI container. Any type that is not registered with dependency injection container
will make a problem in constructor (parameter will be null, or exception will be thrown).

Controller can have multiple constructors, in which case, only one constructor
needs to be decorated with `PrimaryConstructorAttribute` (located in 
`LiteApi.Attributes` namespace). See sample below.

``` csharp
public class SpaceController: LiteController
{
    // this constructor will be called by LiteApi
    [PrimaryConstructor]
    public SpaceController(ISpaceService _service, ISpaceDataService _dataService)
    {
        // ...
    }

    // this one can be called from other code
    public SpaceController()
    {
        // ...
    }
}
```

Generally it's recommended to avoid multiple constructors in controllers. 
Multiple constructors can increase complexity of you application. Instead
you can create multiple implementations of interfaces that are passed to
the constructor.