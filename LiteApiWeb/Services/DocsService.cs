using Microsoft.AspNetCore.Hosting;

namespace LiteApiWeb.Services
{
    public class DocsService : PageService, IDocsService
    {
        public DocsService(IHostingEnvironment host) : base(host, "Docs")
        {
        }
    }
}
