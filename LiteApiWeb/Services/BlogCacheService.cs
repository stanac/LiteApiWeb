using AutoMapper;
using LiteApiWeb.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace LiteApiWeb.Services
{
    public class BlogCacheService : IBlogCacheService
    {
        private readonly IReadOnlyList<RenderedPageContent> _pagesWithoutContent;
        private readonly IReadOnlyList<RenderedPageContent> _pages;

        public BlogCacheService(IBlogPageService service)
        {
            var config = new MapperConfiguration(cfg => cfg.CreateMap<RenderedPageContent, RenderedPageContent>());
            var mapper = config.CreateMapper();

            var pagesTemp = new List<RenderedPageContent>();
            foreach (var p in service.GetPages())
            {
                var content = service.GetPageContent(p.OrderId);
                var rendContent = service.RenderPage(content);
                rendContent.RemoveMarkdownSource();
                pagesTemp.Add(rendContent);
            }
            _pages = pagesTemp.OrderByDescending(x => x.CreatedDate).ToList();
            _pagesWithoutContent = _pages.Select(x =>
            {
                var y = mapper.Map<RenderedPageContent>(x);
                y.ContentHtml = null;
                return y;
            }).OrderByDescending(x => x.CreatedDate).ToList();
        }

        public PagedCollection<RenderedPageContent> GetPage(int pageNumber)
        {
            // TODO: implement paging one day
            return new PagedCollection<RenderedPageContent>(_pagesWithoutContent, 1, 1);
        }

        // TODO: add created date in parameters
        public RenderedPageContent GetPost(string id)
        {
            return _pages.FirstOrDefault(x => id == x.Id);
        }
    }

    public interface IBlogCacheService
    {
        PagedCollection<RenderedPageContent> GetPage(int pageNumber);

        RenderedPageContent GetPost(string id);
    }
}
