using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using LiteApi;
using LiteApiWeb.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Diagnostics;

namespace LiteApiWeb
{
    public class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddScoped<IPageService, PageService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole();

            RenderAllPages(env, app.ApplicationServices);

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            //app.Use(async (ctx, next) =>
            //{
            //    if (ctx.Request.Method.ToUpper() == "GET" && !ctx.Request.Path.StartsWithSegments("/api") && !ctx.Request.Path.Value.Contains("."))
            //    {
            //        ctx.Request.Path = "/index.html";
            //    }
            //    await next.Invoke();
            //});
            app.UseDefaultFiles();

            if (Debugger.IsAttached)
            {
                app.Use(async (httpCtx, next) =>
                {
                    if (httpCtx.Request.Path.Value.Contains("index.html"))
                    {
                        RenderAllPages(env, app.ApplicationServices);
                    }
                    await next.Invoke();
                });
            }
            
            app.UseStaticFiles();

            app.UseLiteApi(LiteApiOptions.Default.SetLoggerFactory(loggerFactory));
            
            app.Run(async (context) =>
            {
                context.Response.StatusCode = 404;
                await context.Response.WriteAsync("Not found");
            });
        }

        private void RenderAllPages(IHostingEnvironment env, IServiceProvider services)
        {
            var pageService = services.GetService<IPageService>() as IPageService;
            string pagesOutPath = Path.Combine(env.ContentRootPath, "wwwroot", "content", "pages");
            string hashesPath = Path.Combine(env.ContentRootPath, "Content", "Hashes", "pages");
            var renderer = new FirstTimeRunRenderer(pageService, pagesOutPath, hashesPath);
            renderer.RenderAll();
        }
    }
}
