namespace LiteApiWeb.Models
{
    public class SearchResultItem
    {
        public int MatchOnTitleWeight { get; set; }
        public PageDetails Page { get; set; }
        public int Hits { get; set; }

        public int Weight => MatchOnTitleWeight + Hits;
    }
}
