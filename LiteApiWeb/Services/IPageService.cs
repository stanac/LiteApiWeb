using System.Collections.Generic;
using LiteApiWeb.Models;

namespace LiteApiWeb.Services
{
    public interface IPageService
    {
        IEnumerable<PageDetails> GetPages();
        PageContent GetPageContent(string pageId);
        RenderedPageContent RenderPage(PageContent pageContent);
    }
}
