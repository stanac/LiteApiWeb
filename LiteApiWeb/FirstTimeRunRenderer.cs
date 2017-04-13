using System.Collections.Generic;
using System.IO;
using LiteApiWeb.Models;
using LiteApiWeb.Services;
using Newtonsoft.Json;
using Markdig;

namespace LiteApiWeb
{
    public class FirstTimeRunRenderer
    {
        private readonly IPageService _service;
        private readonly string _outDir;
        private readonly string _hashesPath;
        private readonly string _shortDir;
        private static readonly MarkdownPipeline _mdPipeline;
        private static readonly object Sync = new object();
        
        static FirstTimeRunRenderer()
        {
            _mdPipeline = new MarkdownPipelineBuilder()
                .UsePragmaLines()
                .UseDiagrams()
                .UseAdvancedExtensions()
                .Build();
        }

        public FirstTimeRunRenderer(IPageService service, string outDir, string hashesPath)
        {
            _service = service;
            _outDir = outDir;
            _shortDir = Path.Combine(outDir, "__short");
            if (!Directory.Exists(outDir))
            {
                Directory.CreateDirectory(outDir);
            }
            if (!Directory.Exists(_shortDir))
            {
                Directory.CreateDirectory(_shortDir);
            }
            _hashesPath = hashesPath;
        }
        
        public void RenderAll()
        {
            lock (Sync)
            {
                Dictionary<string, string> hashes = GetHashes();
                var pages = _service.GetPages();
                foreach (PageDetails page in pages)
                {
                    PageContent content = _service.GetPageContent(page.OriginalId);
                    var hash = StringHasher.Hash(content.ConcatMarkDown());
                    if (hashes.ContainsKey(page.Id))
                    {
                        if (hash == hashes[content.Id])
                        {
                            continue;

                        }
                    }
                    hashes[content.Id] = hash;
                    RenderPage(content);
                }
                WriteHashes(hashes);
            }
        }

        private Dictionary<string, string> GetHashes()
        {
            if (!File.Exists(_hashesPath))
            {
                File.WriteAllText(_hashesPath, JsonConvert.SerializeObject(new Dictionary<string, string>()));
            }

            return JsonConvert.DeserializeObject<Dictionary<string, string>>(File.ReadAllText(_hashesPath));
        }

        private void WriteHashes(Dictionary<string, string> hashes)
        {
            File.WriteAllText(_hashesPath, JsonConvert.SerializeObject(hashes));
        }
        
        private void RenderPage(PageContent page)
        {
            RenderShort(page);

            string filePath = Path.Combine(_outDir, page.Id + ".html");

            string html = page.IsHtml
                ? page.ContentMarkDown
                : Markdown.ToHtml(page.ContentMarkDown, _mdPipeline);

            html = $@"
<div class='user-content'>
{html}
</div>
";

            if (!string.IsNullOrWhiteSpace(page.ShortMarkDown))
            {
                string shortContent = page.IsHtml
                    ? page.ShortMarkDown
                    : Markdown.ToHtml(page.ShortMarkDown, _mdPipeline);
                html = $@"
<div class='short-user-content'>
{shortContent}
</div>

{html}
";
            }
            
            if (page.RenderTitle)
            {
                html = $@"
<h1>{page.Title}</h1>

{html}
";
            }

            File.WriteAllText(filePath, html);
        }

        private void RenderShort(PageContent page)
        {
            if (page.ShortMarkDown == null) return;

            var html = page.IsHtml
                ? page.ShortMarkDown
                : Markdig.Markdown.ToHtml(page.ShortMarkDown, _mdPipeline);
            html = $@"
<div class='short-user-content'>
{html}
</div>
";

            string filePath = Path.Combine(_shortDir, page.Id + ".html");

            File.WriteAllText(filePath, html);
        }
    }
}
