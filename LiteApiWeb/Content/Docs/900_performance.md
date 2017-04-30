---
Author: stanac
CreatedDate: 2017-04-23
Title: Performance
RenderTitle: false
IsHtml: false
Id: performance
---

# Performance comparison between MVC Core and LiteApi

When comparing LiteApi with MVC Core LiteApi is capable of serving 20-30 
percent more requests per second. This comparison is performend on minimal
project with a single controller, before planned LiteApi optimization release.

Web apps are run using `dotnet run` on Krestrel only without logging,
without proxy on localhost using Windows PC:

- Intel(R) Core(TM) i7-4720HQ CPU @ 2.60GHz
- 8GB DDR3 memory
- Windows 10 Pro

## Code & Tool

For testing <a href="https://github.com/hallatore/Netling" target="_blank">Netling</a> is used.

Both apps have minimal dependencies and configuration, you can check it on 
[GitHub repo](https://github.com/stanac/LiteApiPerformanceTest).

Here is MVC controller:

```csharp
[Route("api/[controller]")]
public class AddController : Controller
{
    [HttpGet]
    public int Add(int a, int b) => a + b;
}
```

And LiteApi controller:

```csharp
[Restful]
public class AddController: LiteController
{
    public int Add(int a, int b) => a + b;
}
```

## Results

On following screenshots values in smaller font are of MVC Core sample app,
and values with larger font are representing LiteApi sample app values.
LiteApi is not yet optimized, and it performs 20-30% better than MVC.

<div class="row">
<div class='col-md-12 text-center'>
<img src="/content/imgs/performance/32_threads_pipe_20_thread_off.png" />
</div>
</div>

<div class='row'>&nbsp;</div>

<div class="row">
<div class='col-md-12 text-center'>
<img src="/content/imgs/performance/64_threads_pipe_20_thread_off.png" />
</div>
</div>

<div class='row'>&nbsp;</div>

<div class="row">
<div class='col-md-12 text-center'>
<img src="/content/imgs/performance/8_threads_pipe_10_thread_on.png" />
</div>
</div>