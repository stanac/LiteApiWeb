using System;
using System.IO;
using System.Linq;
using LiteApi;
using LiteApiWeb.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Diagnostics;
using Newtonsoft.Json;
using Microsoft.Extensions.Configuration;

namespace LiteApiWeb
{
    public class Startup
    {
        public readonly IConfigurationRoot _config;
        private readonly bool _enableFirstRunRender;
        public static SearchCacheService DocsSearch { get; private set; }

        public Startup()
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("config.json");

            _config = builder.Build();
            const string key = "enableFirstTimeRender";
            bool parse;
            if (_config.AsEnumerable().Any(x => x.Key == key)
                && bool.TryParse(_config[key], out parse))
            {
                _enableFirstRunRender = parse;
            }
            else
            {
                _enableFirstRunRender = true;
            }
        }
        
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddScoped<IPageService, PageService>();
            services.AddScoped<IDocsService, DocsService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            // loggerFactory.AddConsole();

            if (_enableFirstRunRender)
            {
                RenderAllPages(env, app.ApplicationServices);
            }

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.Use(async (httpCtx, next) =>
            {
                if (httpCtx.Request.Method == "GET" &&
                    (httpCtx.Request.Path.StartsWithSegments("/docs")
                    || httpCtx.Request.Path.StartsWithSegments("/blog")
                    || httpCtx.Request.Path.StartsWithSegments("/getting-started")
                    || httpCtx.Request.Path.StartsWithSegments("/search")
                    || httpCtx.Request.Path.StartsWithSegments("/api-docs")
                    ))
                {
                    httpCtx.Request.Path = "/";
                }
                await next.Invoke();
            });
            
            app.UseDefaultFiles();

            if (Debugger.IsAttached && _enableFirstRunRender)
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
            IDocsService docsService = services.GetService<IDocsService>();

            RenderAll<IPageService>(env, services, "pages");
            RenderAll<IDocsService>(env, services, "docs");
            RenderDocsIndex(env, docsService);

            string docsPath = Path.Combine(env.ContentRootPath, "wwwroot", "content", "docs");
            DocsSearch = new SearchCacheService(docsPath, docsService);
        }

        private void RenderAll<T>(IHostingEnvironment env, IServiceProvider services, string path)
            where T: IPageService
        {
            var service = services.GetService<T>() as IPageService;
            string outPath = Path.Combine(env.ContentRootPath, "wwwroot", "content", path);
            string hashPath = Path.Combine(env.ContentRootPath, "Content", "Hashes", path);
            var renderer = new FirstTimeRunRenderer(service, outPath, hashPath);
            renderer.RenderAll();
        }

        private void RenderDocsIndex(IHostingEnvironment env, IDocsService service)
        {
            string jsonFilePath = Path.Combine(env.ContentRootPath, "wwwroot", "content", "docs", "index.json");
            var docs = Models.StructuredPageModel.GetStructuredPages(service.GetPages().ToArray());
            string json = JsonConvert.SerializeObject(docs);
            File.WriteAllText(jsonFilePath, json);
        }
    }
}
