using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using LiteApiWeb.Models;

namespace LiteApiWeb.Services
{
    public static class FrontMatterParser
    {
        private static readonly char[] _tagSeparators = { ' ' };
        private static readonly char[] _dateTimeSeparators = { '-' };
        private static readonly PropertyData[] _props =
            typeof(PageDetails).GetProperties(BindingFlags.Instance | BindingFlags.Public)
            .Select(x => new PropertyData(x))
            .Where(x => x.Name != "Id")
            .ToArray();
        
        public static PageDetails Parse(List<string> frontMatter)
        {
            PageDetails retValue = new PageDetails();
            var props = _props.Select(x => x.Clone()).ToArray();

            foreach (var line in frontMatter)
            {
                PropertyData prop = GetPropertyDataFor(GetPropertyName(line), props);
                object value = ParseValue(line, prop);
                prop.Property.SetValue(retValue, value);
                prop.IsSet = true;
            }

            // set defaults;
            var notSet = props.Where(x => !x.IsSet && x.DefaultValue != null);
            foreach (var p in notSet)
            {
                object value = ParseValue($"a: {p.DefaultValue}", p);
                p.Property.SetValue(retValue, value);
            }
            return retValue;
        }

        private static object ParseValue(string line, PropertyData pd)
        {
            object value = null;
            if (pd.Type == typeof(bool))
            {
                value = ParseBool(line);
            }
            else if (pd.Type == typeof(string))
            {
                value = ParseString(line);
            }
            else if (pd.Type == typeof(DateTime))
            {
                value = ParseDateTime(line);
            }
            else if (pd.Type == typeof(string[]))
            {
                value = ParseStrings(line);
            }
            return value;
        }

        private static bool ParseBool(string line)
        {
            string value = GetValue(line);
            return bool.Parse(value);
        }

        private static DateTime ParseDateTime(string line)
        {
            string value = GetValue(line);
            var parts = value.Split(_dateTimeSeparators, StringSplitOptions.RemoveEmptyEntries);
            int y = int.Parse(parts[0]);
            int m = int.Parse(parts[1]);
            int d = int.Parse(parts[2]);

            return new DateTime(y, m, d);
        }

        private static string ParseString(string line)
            => GetValue(line);

        private static string[] ParseStrings(string line)
            => ParseStrings(line, _tagSeparators);

        private static string[] ParseStrings(string line, char[] separators)
        {
            string value = GetValue(line);
            return value.Split(separators, StringSplitOptions.RemoveEmptyEntries);
        }

        private static string GetValue(string line)
        {
            int firstIndex = line.IndexOf(':');
            return line.Substring(firstIndex + 1, line.Length - firstIndex - 1).Trim();
        }

        private static string GetPropertyName(string line)
        {
            int firstIndex = line.IndexOf(':');
            return line.Substring(0, firstIndex).Trim();
        }

        private static PropertyData GetPropertyDataFor(string name, PropertyData[] data)
            => data.First(x => x.Name == name);

        private class PropertyData
        {
            private PropertyData() { }

            public PropertyData(PropertyInfo info)
            {
                Property = info;
                Name = info.Name;
                Type = info.PropertyType;

                var typeInfo = Type.GetTypeInfo();
                if (typeInfo.IsGenericType && typeInfo.GetGenericTypeDefinition() == typeof(Nullable<>))
                {
                    Type = typeInfo.GetGenericArguments().Single();
                }

                var attr = info.GetCustomAttribute<DefaultValueAttribute>();
                if (attr != null)
                {
                    DefaultValue = attr.Value;
                }
            }
            
            public bool IsSet { get; set; }
            public PropertyInfo Property { get; private set; }
            public string Name { get; private set; }
            public Type Type { get; private set; }
            public string DefaultValue { get; private set; }

            public PropertyData Clone(bool skipIsSet = true)
            {
                var pd = new PropertyData
                {
                    Property = Property,
                    Name = Name,
                    Type = Type,
                    DefaultValue = DefaultValue
                };
                if (!skipIsSet)
                {
                    pd.IsSet = IsSet;
                }
                return pd;
            }
        }
    }
}
