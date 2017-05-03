using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using System.Diagnostics;

namespace LiteApiWeb
{
    public class Program
    {
        public static void Main(string[] args)
        {
            bool isDebugging = Debugger.IsAttached;

            var host = new WebHostBuilder()
                .UseKestrel()
                .UseContentRoot(Directory.GetCurrentDirectory());

            if (isDebugging) host.UseIISIntegration();
            else host.UseUrls($"http://localhost:{GetPort()}");

            host.UseStartup<Startup>();

            host.Build().Run();
        }

        private static int GetPort()
        {
            int port = 4772;
            try
            {
                string dir = Directory.GetCurrentDirectory();
                var file = Directory.GetFiles(dir, "port").FirstOrDefault();
                if (file != null)
                {
                    string text = File.ReadAllText(file);
                    if (int.TryParse(text, out port)) return port;
                }
            }
            catch
            {
                return 4772;
            }
            return 4772;
        }
    }
}
