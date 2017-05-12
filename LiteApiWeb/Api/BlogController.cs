using LiteApi;
using LiteApi.Attributes;
using LiteApiWeb.Models;
using LiteApiWeb.Services;
using System.Linq;

namespace LiteApiWeb.Api
{
    [Restful]
    public class BlogController: LiteController
    {
        private const int PostsPerPage = 5;
        
        [ActionRoute("/page/{pageNumber}")]
        public PagedCollection<RenderedPageContent> Page([FromServices] IBlogCacheService service, int pageNumber)
            => service.GetPage(pageNumber);

        [ActionRoute("/{id}")]
        public RenderedPageContent GetBlogPost([FromServices] IBlogCacheService service, string id)
            => service.GetPost(id);
    }
}
