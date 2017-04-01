using System.Collections.Concurrent;
using System.Text;

namespace LiteApiWeb
{
    public class StringBuilderPool
    {
        private ConcurrentBag<StringBuilder> _sbs = new ConcurrentBag<StringBuilder>();

        public static StringBuilderPool Default { get; } = new StringBuilderPool();

        public StringBuilderPool()
        {
            _sbs.Add(new StringBuilder());
            _sbs.Add(new StringBuilder());
            _sbs.Add(new StringBuilder());
            _sbs.Add(new StringBuilder());
        }

        public StringBuilder GetStringBuilder()
        {
            StringBuilder sb;
            return _sbs.TryTake(out sb) ? sb : new StringBuilder();
        }

        public void PutBack(StringBuilder sb)
        {
            sb.Clear();
            _sbs.Add(sb);
        }
    }
}
