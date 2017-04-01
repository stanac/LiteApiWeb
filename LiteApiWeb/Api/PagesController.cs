using System.Collections.Generic;
using System.Linq;
using LiteApi;
using LiteApi.Attributes;
using LiteApiWeb.Models;
using LiteApiWeb.Services;

namespace LiteApiWeb.Api
{
    [RestfulLinks]
    public class PagesController: LiteController
    {
        private readonly IPageService _service;

        public PagesController(IPageService service)
        {
            _service = service;
        }

        [HttpGet]
        public IEnumerable<PageDetails> All()
            => _service.GetPages();

        [HttpGet, ActionRoute("/{pageid}")]
        public RenderedPageContent GetPage(string pageid)
        {
            var content = _service.GetPageContent(pageid);
            var page = _service.RenderPage(content);
            return page;
        }

        [HttpGet, ActionRoute("/html/{name}")]
        public object Html(string name)
        {
            var rendered = GetPage(name);
            string html = (rendered.ShortHtml ?? "") + rendered.ContentHtml;
            return new { html };
        }
    }
}
