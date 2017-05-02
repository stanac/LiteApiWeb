//using System.Collections.Generic;
//using System.Linq;

//namespace LiteApiWeb.Services
//{
//    public static class Combinator
//    {
//        public static IEnumerable<T[]> GetCombinations<T>(this IEnumerable<T> items)
//        {
//            var array = items.Select(x => x).ToArray();
//            return GetCombinations(array, array.Length);
//        }

//        private static IEnumerable<T[]> GetCombinations<T>(T[] items, int numberToTake)
//        {
//            if (numberToTake > items.Length) numberToTake = items.Length;

//            if (numberToTake == 0) yield break;

//            if (numberToTake == 1)
//            {
//                foreach (var item in items)
//                {
//                    yield return new[] { item };
//                }
//            }
//            else
//            {
//                for (int i = 0; i < items.Length - numberToTake; i++)
//                {
                    
//                    List<T> temp = new List<T>();

//                    var elements = items.Take(numberToTake);
//                }
//            }

//            foreach (var item in GetCombinations(items, numberToTake - 1))
//            {
//                yield return item;
//            }
//        }
//    }
//}
