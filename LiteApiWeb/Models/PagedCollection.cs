using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace LiteApiWeb.Models
{
    public class PagedCollection<T> : IEnumerable<T>
    {
        public PagedCollection(IEnumerable<T> collection, int pageNumber, int pageCount)
        {
            _collection = collection.ToArray();
            PageNumber = pageNumber;
            PageCount = pageCount;
        }

        private T[] _collection;

        public int PageNumber { get; private set; }

        public int PageCount { get; private set; }

        public IEnumerator<T> GetEnumerator()
        {
            foreach (var item in _collection)
                yield return item;
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }
    }
}
