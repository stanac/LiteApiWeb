using System;

namespace LiteApiWeb.Models
{
    public class PageDetails
    {
        /// <summary>
        /// Gets or sets the identifier. Can be file name for example.
        /// </summary>
        /// <value>
        /// The identifier.
        /// </value>
        public string Id { get; set; }
        public string OriginalId { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public DateTime CreatedDate { get; set; }
        public string EditedBy { get; set; }
        public DateTime? EditedDate { get; set; }
        [DefaultValue("true")]
        public bool RenderTitle { get; set; }
        public string[] Tags { get; set; } = new string[0];
        public bool IsHtml { get; set; }
        public string ParentPageId { get; set; }
    }
}
