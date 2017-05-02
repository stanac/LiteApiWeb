using LiteApi;
using LiteApi.Attributes;
using LiteApiWeb.Models;
using System.Collections.Generic;
using System.Linq;

namespace LiteApiWeb.Api
{
    [RestfulLinks]
    public class DocsController: LiteController
    {
        [HttpGet,ActionRoute("/search/{query}")]
        public IEnumerable<SearchResultItem> Search(string query)
        {
            return Startup.DocsSearch.Search(query)
                .Where(x => x.Hits > 2)
                .OrderByDescending(x => x.Weight);
        }
    }
}
