---
Author: stanac
CreatedDate: 2017-04-15
Title: Action overloading
RenderTitle: false
IsHtml: false
Id: action-overloading
ParentPageId: controller-and-action-matching
---

# Action overloading

LiteApi supports action overloading. This means that two actions can respond to same URL and HTTP method as 
long as they accept different parameters (same rules as in C# language with some special cases). 

<div class="alert alert-info">
Performance-wise it's best to name parameters differently when overloading actions.
</div>

Here is a sample controller.

```csharp
public class PersonController: LiteController
{
     public int Add(int a, int b) => a + b;

     public string Add(string a, string b) => a + b;
}
```

Since parameters in sample above are named the same, middleware will try to parse integers, and if 
parsing was successful, `Add(int, int)` will be called, otherwise `Add(string, string)` will
be called. If you want to be sure which action will be called simplest solution would be to name
parameters differently.

## Overloading with array

If action is overloaded with array and parameters have same name, LiteApi will always call action with array.

```csharp
public class MyController: LiteController
{
    public int Action1(int i) => return i;

    public int Action1(int[] i) => i.Sum();
}
```

In this case action with `int[] i` will be called, regardless if there is one or more values provided for `i`. 
This way it's easier for middleware to decide which of the methods to call. Similar behavior can be encountered 
with overloading methods with parameters `int`, `int?`, `int[]` and `int?[]`. In order to decide which 
method to use, LiteApi will choose the method that can handle most of the edge cases. Here is the priority 
where top choice has the most priority:
 
- `int?[]`
- `int?`
- `int[]`
- `int`

Same can be said for `float?`, `Guid?`, `DateTime?`, and so on.

Another example would be to have two actions with same routes and parameter names where one action 
accepts `int? i` and the other `int[] i`. Action with `int? i` will be chosen and if there is more than 
one value for `i` it can be expected the last value to be used (but it's not guaranteed). It would be best to 
avoid this type of overloading by naming the parameters differently, it would also lower the time it takes to 
choose the right action since middleware would have less work to perform.

