using Microsoft.AspNetCore.Hosting;

namespace LiteApiWeb.Services
{
    public class BlogPageService : PageService, IBlogPageService
    {
        public BlogPageService(IHostingEnvironment host) 
            : base(host, "BlogPosts", true)
        {
        }
    }
}
