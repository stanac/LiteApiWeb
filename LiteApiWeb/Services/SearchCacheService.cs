using LiteApiWeb.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;

namespace LiteApiWeb.Services
{
    public class SearchCacheService
    {
        private readonly List<SearchCacheModel> _cache = new List<SearchCacheModel>();
        private readonly char[] _separator = " ".ToCharArray();

        public SearchCacheService(string renderedContentDir, IPageService pageService)
        {
            var files = Directory.GetFiles(renderedContentDir, "*.html");
            var pages = pageService.GetPages().ToArray();
            foreach (var file in files)
            {
                string key = Path.GetFileNameWithoutExtension(file);
                string content = File.ReadAllText(file);
                content = Regex.Replace(content, @"<[^>]+>|&nbsp;", " ").Trim();
                content = content
                    .Replace("&quot;/", "\"")
                    .Replace("&quot;", "\"")
                    .Replace("&lt;", "<")
                    .Replace("&gt;", ">");
                content = Regex.Replace(content, @"\s{2,}", " ");

                var page = pages.First(x => x.Id == key);

                _cache.Add(new SearchCacheModel
                {
                    Content = content,
                    Page = page,
                    Title = page.Title,
                    TitleLowerCase = page.Title.ToLower()
                });
            }
        }

        public IEnumerable<SearchResultItem> Search(string query)
        {
            query = (query ?? "").ToLower().Trim();
            if (query.Length < 4) yield break;
            string[] words = query.Split(_separator, StringSplitOptions.RemoveEmptyEntries).Distinct().ToArray();
            
            foreach (var item in _cache)
            {
                var response = new SearchResultItem
                {
                    Page = item.Page,
                    MatchOnTitleWeight = item.TitleLowerCase.Contains(query) ? 20 : 0,
                    Hits = item.Content.Split(new string[] { query }, StringSplitOptions.None).Length - 1
                };
                if (response.Hits < 0) response.Hits = 0;
                response.Hits *= 2;
                foreach (var word in words)
                {
                    response.MatchOnTitleWeight += item.Title.Contains(word) ? 5 : 0;
                    response.Hits += item.Content.Split(new string[] { word }, StringSplitOptions.None).Length;
                }
                if (response.Weight > 0) yield return response;
            }
        }
        
    }
    
}
