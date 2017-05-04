using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using AutoMapper;
using LiteApiWeb.Models;
using Microsoft.AspNetCore.Hosting;
using Markdig;
using System.Linq;

namespace LiteApiWeb.Services
{
    public class PageService : IPageService
    {
        private readonly string _rootDir;
        private static readonly MarkdownPipeline _mdPipeline = 
            new MarkdownPipelineBuilder()
                .UsePragmaLines()
                .UseDiagrams()
                .UseAdvancedExtensions()
                .Build();

        private static readonly IMapper _mapFromContentToDetails;

        static PageService()
        {
            var config = new MapperConfiguration(cfg => cfg.CreateMap<PageContent, PageDetails>());
            _mapFromContentToDetails = config.CreateMapper();
        }
        
        public PageService(IHostingEnvironment host, string contentDirectory = "Pages")
        {
            string rootDir = Path.Combine(host.ContentRootPath, "Content", contentDirectory);
            if (!Directory.Exists(rootDir)) throw new ArgumentException($"dir {rootDir} doesn't exists.");
            _rootDir = rootDir;
        }

        public IEnumerable<PageDetails> GetPages()
        {
            List<PageDetails> pages = new List<PageDetails>();
            foreach (var file in Directory.GetFiles(_rootDir, "*.md"))
            {
                var page = ReadPage(Path.GetFileName(file), false);
                pages.Add(_mapFromContentToDetails.Map<PageDetails>(page));
            }
            return pages.OrderBy(x => x.OrderId);
        }

        public PageContent GetPageContent(string pageId)
        {
            if (!pageId.EndsWith(".md", StringComparison.OrdinalIgnoreCase)) pageId += ".md";
            return ReadPage(pageId, true);
        }

        private PageContent ReadPage(string file, bool readContent)
        {
            string orderId = file;
            file = Path.Combine(_rootDir, file);
            string content = File.ReadAllText(file);
            StringBuilder sb = StringBuilderPool.Default.GetStringBuilder();
            string shortSplitLine = null;
            string line = null;
            bool frontMatterRead = false;
            List<string> frontMatter = new List<string>();
            int separatorsOccured = 0;
            using (TextReader reader = new StringReader(content))
            {
                while ((line = reader.ReadLine()) != null)
                {
                    if (!frontMatterRead)
                    {
                        if (line.StartsWith("---", StringComparison.OrdinalIgnoreCase))
                        {
                            separatorsOccured++;
                            if (separatorsOccured == 2)
                            {
                                frontMatterRead = true;
                                continue;
                            }
                        }
                        else
                        {
                            frontMatter.Add(line);
                        }
                    }
                    else if (!readContent)
                    {
                        break;
                    }
                    else
                    {
                        string trimmed = line.Trim();
                        if (trimmed.StartsWith("<!--", StringComparison.Ordinal) 
                            && trimmed.EndsWith("-->", StringComparison.Ordinal)
                            && trimmed.Contains("short end"))
                        {
                            shortSplitLine = line;
                        }
                        sb.AppendLine(line);
                    }
                }
            }
            
            var page = new PageContent(FrontMatterParser.Parse(frontMatter));
            page.OrderId = orderId;
            if (readContent)
            {
                page.ContentMarkDown = sb.ToString();
                if (shortSplitLine != null)
                {
                    var parts = page.ContentMarkDown.Split(new string[] { shortSplitLine }, StringSplitOptions.None);
                    if (parts.Length > 1)
                    {
                        page.ShortMarkDown = parts[0];
                        page.ContentMarkDown = parts[1];
                    }
                }
            }

            if (page.Id == null)
            {
                page.Id = Path.GetFileNameWithoutExtension(file);
            }
            page.OriginalId = Path.GetFileNameWithoutExtension(file);
            StringBuilderPool.Default.PutBack(sb);
            return page;
        }

        public RenderedPageContent RenderPage(PageContent page)
        {
            // todo: check render title
            var retPage = new RenderedPageContent(page);
            if (!string.IsNullOrWhiteSpace(retPage.ShortMarkDown))
            {
                retPage.ShortHtml = Markdown.ToHtml(page.ShortMarkDown, _mdPipeline);
            }
            retPage.ContentHtml = Markdown.ToHtml(page.ContentMarkDown, _mdPipeline);

            return retPage;
        }
                
    }
}
