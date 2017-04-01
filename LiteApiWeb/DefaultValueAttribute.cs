using System;

namespace LiteApiWeb
{
    [AttributeUsage(AttributeTargets.Property, AllowMultiple = false)]
    public class DefaultValueAttribute: Attribute
    {
        public string Value { get; private set; }

        public DefaultValueAttribute(string value)
        {
            Value = value;
        }
    }
}
