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
using Newtonsoft.Json;
using Microsoft.AspNetCore.ResponseCompression;
using System.IO.Compression;

namespace LiteApiWeb
{
    public class Startup
    {
        //public readonly IConfigurationRoot _config;
        // private readonly bool _enableFirstRunRender;
        public static string WwwRootPath { get; private set; }
        public static SearchCacheService DocsSearch { get; private set; }

        public Startup()
        {
            //var builder = new ConfigurationBuilder()
            //    .SetBasePath(Directory.GetCurrentDirectory())
            //    .AddJsonFile("config.json");

            //_config = builder.Build();
            //const string key = "enableFirstTimeRender";
            //bool parse;
            //if (_config.AsEnumerable().Any(x => x.Key == key)
            //    && bool.TryParse(_config[key], out parse))
            //{
            //    _enableFirstRunRender = parse;
            //}
            //else
            //{
            //    _enableFirstRunRender = true;
            //}
        }
        
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddResponseCompression(o =>
            {
                o.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(new[] { "image/svg+xml" });
            });
            services.Configure<GzipCompressionProviderOptions>(options =>
            {
                options.Level = CompressionLevel.Fastest;
            });
            services.AddScoped<IPageService, PageService>();
            services.AddScoped<IDocsService, DocsService>();
            services.AddScoped<IBlogPageService, BlogPageService>();
            services.AddSingleton<IBlogCacheService, BlogCacheService>();
        }
        
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            WwwRootPath = Path.Combine(env.ContentRootPath, "wwwroot");
            
            // loggerFactory.AddConsole();

            //if (_enableFirstRunRender)
            //{
                RenderAllPages(env, app.ApplicationServices);
            // ParseApi(env.ContentRootPath);
            //}


            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.Use(BundleAndMinify.Middleware);

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
//            RenderAll<IBlogCacheService>(env, services, "blog")
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

        //private void ParseApi(string rootPath)
        //{
        //    string path = Path.Combine(rootPath, "Content", "NugetSource");
        //    var reader = new DocsReader(path);
        //    reader.DownloadAndParse().Wait();
        //}
    }
}
