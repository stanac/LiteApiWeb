namespace LiteApiWeb.Models
{
    public class RenderedPageContent: PageContent
    {
        public RenderedPageContent() { }

        public RenderedPageContent(PageContent page)
        {
            this.Author = page.Author;
            this.ContentMarkDown = page.ContentMarkDown;
            this.CreatedDate = page.CreatedDate;
            this.EditedBy = page.EditedBy;
            this.EditedDate = page.EditedDate;
            this.Id = page.Id;
            this.Tags = page.Tags;
            this.RenderTitle = page.RenderTitle;
            this.ShortMarkDown = page.ShortMarkDown;
            this.Title = page.Title;
            this.RenderTitle = page.RenderTitle;
            this.IsHtml = page.IsHtml;
            this.ParentPageId = page.ParentPageId;
        }

        public string ShortHtml { get; set; }
        public string ContentHtml { get; set; }
    }
}
