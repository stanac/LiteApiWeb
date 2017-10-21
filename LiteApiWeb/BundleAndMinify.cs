using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace LiteApiWeb
{
    public static class BundleAndMinify
    {
        private static readonly string _css;
        private static readonly string _js;

        static BundleAndMinify()
        {
            StringBuilder sb = new StringBuilder();

            sb.AppendLine(File.ReadAllText(Path.Combine(Startup.WwwRootPath, "libs", "bootstrap-3.3.7.min.css")));
            sb.AppendLine(File.ReadAllText(Path.Combine(Startup.WwwRootPath, "style.css")));
            sb.AppendLine(File.ReadAllText(Path.Combine(Startup.WwwRootPath, "libs", "prism.css")));

            string css = sb.ToString();

            sb.Clear();

            sb.AppendLine(File.ReadAllText(Path.Combine(Startup.WwwRootPath, "libs", "nanoajax.min.js")));
            sb.AppendLine(File.ReadAllText(Path.Combine(Startup.WwwRootPath, "libs", "vue.min.js")));
            sb.AppendLine(File.ReadAllText(Path.Combine(Startup.WwwRootPath, "libs", "vue-router.min.js")));
            sb.AppendLine(File.ReadAllText(Path.Combine(Startup.WwwRootPath, "libs", "es-6-shim.0.35.3.min.js")));
            sb.AppendLine(File.ReadAllText(Path.Combine(Startup.WwwRootPath, "libs", "prism.js")));
            sb.AppendLine(File.ReadAllText(Path.Combine(Startup.WwwRootPath, "libs", "jquery-3.2.1.slim.min.js")));
            sb.AppendLine(File.ReadAllText(Path.Combine(Startup.WwwRootPath, "libs", "bootstrap-3.3.7.min.js")));
            sb.AppendLine(File.ReadAllText(Path.Combine(Startup.WwwRootPath, "bundle-app.js")));

            string js = sb.ToString();

            sb.Clear();

            var minifiedCss = NUglify.Uglify.Css(css);
            if (!minifiedCss.HasErrors)
            {
                _css = minifiedCss.Code;
            }
            else
            {
                throw new Exception("Failed to minify css");
            }

            var minifiedJs = NUglify.Uglify.Js(js, new NUglify.JavaScript.CodeSettings
            {
                PreserveImportantComments = true
            });
            if (!minifiedCss.HasErrors)
            {
                _js = minifiedJs.Code;
            }
            else
            {
                throw new Exception("Failed to minify js");
            }
        }

        public static Func<HttpContext, Func<Task>, Task> Middleware { get; } =
            async (context, next) =>
            {
                if (context.Request.Path.StartsWithSegments("/mini"))
                    await HandleRequest(context, next);
                else
                    await next.Invoke();
            };

        private static async Task HandleRequest(HttpContext ctx, Func<Task> next)
        {
            if (ctx.Request.Path == "/mini/bundle.js")
            {
                await HandleJs(ctx);
            }
            else if (ctx.Request.Path == "/mini/bundle.css")
            {
                await HandleCss(ctx);
            }
            else
            {
                await next.Invoke();
            }
        }

        private static async Task HandleCss(HttpContext ctx)
        {
            ctx.Response.StatusCode = 200;
            ctx.Response.Headers.Add("max-age", "1296000");
            ctx.Response.Headers.Add("content-type", "text/css");
            await ctx.Response.WriteAsync(_css);
        }

        private static async Task HandleJs(HttpContext ctx)
        {
            ctx.Response.StatusCode = 200;
            ctx.Response.Headers.Add("max-age", "86400");
            ctx.Response.Headers.Add("content-type", "application/javascript");
            await ctx.Response.WriteAsync(_js);
        }
    }
}
