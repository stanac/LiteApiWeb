---
Author: stanac
CreatedDate: 2017-03-30
Title: Controller recognition
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