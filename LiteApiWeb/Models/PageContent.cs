namespace LiteApiWeb.Models
{
    public class PageContent: PageDetails
    {
        public PageContent() { }

        public PageContent(PageDetails details)
        {
            this.Author = details.Author;
            this.CreatedDate = details.CreatedDate;
            this.EditedBy = details.EditedBy;
            this.EditedDate = details.EditedDate;
            this.Id = details.Id;
            this.IsHtml = details.IsHtml;
            this.Tags = details.Tags;
            this.ParentPageId = details.ParentPageId;
            this.RenderTitle = details.RenderTitle;
            this.Title = details.Title;
        }

        public string ShortMarkDown { get; set; }
        public string ContentMarkDown { get; set; }
    }
}
