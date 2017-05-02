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
        public IEnumerable<object> Search(string query)
        {
            return Startup.DocsSearch.Search(query)
                .OrderByDescending(x => x.Weight)
                .Select(x =>
                new
                {
                    id = x.Page.Id,
                    title = x.Page.Title,
                    weight = x.Weight
                });
        }
    }
}
