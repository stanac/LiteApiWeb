using System.Collections.Generic;
using System.Linq;

namespace LiteApiWeb.Models
{
    public class StructuredPageModel
    {
        public PageDetails Page { get; set; }
        public List<StructuredPageModel> Children { get; private set; } = new List<StructuredPageModel>();

        public static IEnumerable<StructuredPageModel> GetStructuredPages(PageDetails[] pages)
        {
            var rootPages = pages.Where(x => x.ParentPageId == null);
            foreach (var page in rootPages)
            {
                var model = new StructuredPageModel
                {
                    Page = page
                };
                SetChildren(model, pages);
                yield return model;
            }
        }

        private static void SetChildren(StructuredPageModel model, PageDetails[] pages)
        {
            var children = pages.Where(x => x.ParentPageId == model.Page.Id);
            model.Children.AddRange(children.Select(x => new StructuredPageModel { Page = x }));

            foreach (var c in model.Children)
            {
                SetChildren(c, pages);
            }
        }
    }
}
