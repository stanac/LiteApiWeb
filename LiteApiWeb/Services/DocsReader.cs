using Newtonsoft.Json;
using System;
using System.Diagnostics;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net.Http;
using System.Reflection;
using System.Runtime.Loader;
using System.Threading.Tasks;

namespace LiteApiWeb.Services
{
    /// <summary>
    /// Reads and parses releases from Nuget
    /// </summary>
    public class DocsReader
    {
        private readonly string _sourceDir;

        public DocsReader(string sourceDir)
        {
            _sourceDir = sourceDir;
        }

        public async Task DownloadAndParse()
        {
            if (!Debugger.IsAttached)
            {
                await DownloadSources();
            }
            ParseSources();
        }

        private async Task DownloadSources()
        {
            const string listUrl = "https://api.nuget.org/v3/registration1/liteapi/index.json";
            HttpClient client = new HttpClient();
            string json = await client.GetStringAsync(listUrl);

            NugetPackageInfo info = JsonConvert.DeserializeObject<NugetPackageInfo>(json);
            var packages = info.items[0].items;

            foreach (var p in packages)
            {
                await DownloadPackage(p.packageContent, client);
            }
        }

        private void ParseSources()
        {
            var nugets = Directory.GetFiles(_sourceDir, "*.nupkg");
            foreach (var filePath in nugets)
            {
                var jsonFile = $"{filePath}.json";
                if (!File.Exists(jsonFile))
                {
                    ParseFile(filePath);
                }
            }
        }

        private void ParseFile(string filePah)
        {
            var zip = ZipFile.OpenRead(filePah);
            var dllEntry = zip.Entries.FirstOrDefault(x => x.FullName.ToLower().Contains("liteapi.dll"));
            var xmlEntry = zip.Entries.FirstOrDefault(x => x.FullName.ToLower().Contains("liteapi.xml"));
            var pdbEntry = zip.Entries.FirstOrDefault(x => x.FullName.ToLower().Contains("liteapi.pdb"));

            if (dllEntry == null || xmlEntry == null || pdbEntry == null)
            {
                return;
            }
            Assembly ass = null;
            string xml = null;
            using (var xmlStream = xmlEntry.Open())
            using (var xmlReader = new StreamReader(xmlStream))
            {
                xml = xmlReader.ReadToEnd();
            }

            using (Stream dllStream = dllEntry.Open())
            using (Stream pdbStream = pdbEntry.Open())
            using (Stream memDll = new MemoryStream())
            using (Stream memPdb = new MemoryStream())
            {
                dllStream.CopyTo(memDll);
                dllStream.CopyTo(memPdb);
                memDll.Position = 0;
                memPdb.Position = 0;
                ass = AssemblyLoadContext.Default.LoadFromStream(memDll, memPdb);
            }


        }

        private void ProcessVersion(Assembly assembly)
        {

        }



        private async Task DownloadPackage(string url, HttpClient client)
        {
            string fileName = Path.GetFileName(url);
            string filePath = Path.Combine(_sourceDir, fileName);
            if (!File.Exists(filePath))
            {
                byte[] data = await client.GetByteArrayAsync(url);
                using (Stream s = new FileStream(filePath, FileMode.Create))
                {
                    await s.WriteAsync(data, 0, data.Length);
                }
            }
        }

        private class NugetPackageInfo
        {
            public string id { get; set; }
            public string[] type { get; set; }
            public string commitId { get; set; }
            public DateTime commitTimeStamp { get; set; }
            public int count { get; set; }
            public Item[] items { get; set; }
            public Context context { get; set; }

            public class Context
            {
                public string vocab { get; set; }
                public string catalog { get; set; }
                public string xsd { get; set; }
                public Items items { get; set; }
                public Committimestamp commitTimeStamp { get; set; }
                public Commitid commitId { get; set; }
                public Count count { get; set; }
                public Parent parent { get; set; }
                public Tags tags { get; set; }
                public Packagetargetframeworks packageTargetFrameworks { get; set; }
                public Dependencygroups dependencyGroups { get; set; }
                public Dependencies dependencies { get; set; }
                public Packagecontent packageContent { get; set; }
                public Published published { get; set; }
                public Registration registration { get; set; }
            }

            public class Items
            {
                public string id { get; set; }
                public string container { get; set; }
            }

            public class Committimestamp
            {
                public string id { get; set; }
                public string type { get; set; }
            }

            public class Commitid
            {
                public string id { get; set; }
            }

            public class Count
            {
                public string id { get; set; }
            }

            public class Parent
            {
                public string id { get; set; }
                public string type { get; set; }
            }

            public class Tags
            {
                public string container { get; set; }
                public string id { get; set; }
            }

            public class Packagetargetframeworks
            {
                public string container { get; set; }
                public string id { get; set; }
            }

            public class Dependencygroups
            {
                public string container { get; set; }
                public string id { get; set; }
            }

            public class Dependencies
            {
                public string container { get; set; }
                public string id { get; set; }
            }

            public class Packagecontent
            {
                public string type { get; set; }
            }

            public class Published
            {
                public string type { get; set; }
            }

            public class Registration
            {
                public string type { get; set; }
            }

            public class Item
            {
                public string id { get; set; }
                public string type { get; set; }
                public string commitId { get; set; }
                public DateTime commitTimeStamp { get; set; }
                public int count { get; set; }
                public SubItem[] items { get; set; }
                public string parent { get; set; }
                public string lower { get; set; }
                public string upper { get; set; }
            }

            public class SubItem
            {
                public string id { get; set; }
                public string type { get; set; }
                public string commitId { get; set; }
                public DateTime commitTimeStamp { get; set; }
                public Catalogentry catalogEntry { get; set; }
                public string packageContent { get; set; }
                public string registration { get; set; }
            }

            public class Catalogentry
            {
                [JsonProperty("@id")]
                public string id_link { get; set; }
                public string type { get; set; }
                public string authors { get; set; }
                public Dependencygroup[] dependencyGroups { get; set; }
                public string description { get; set; }
                public string iconUrl { get; set; }
                [JsonProperty("id")]
                public string id { get; set; }
                public string language { get; set; }
                public string licenseUrl { get; set; }
                public bool listed { get; set; }
                public string minClientVersion { get; set; }
                public string packageContent { get; set; }
                public string projectUrl { get; set; }
                public DateTime published { get; set; }
                public bool requireLicenseAcceptance { get; set; }
                public string summary { get; set; }
                public string[] tags { get; set; }
                public string title { get; set; }
                public string version { get; set; }
            }

            public class Dependencygroup
            {
                public string id { get; set; }
                public string type { get; set; }
                public Dependency[] dependencies { get; set; }
            }

            public class Dependency
            {
                [JsonProperty("@id")]
                public string id_link { get; set; }
                public string type { get; set; }
                [JsonProperty("id")]
                public string id { get; set; }
                public string range { get; set; }
                public string registration { get; set; }
            }
        }
    }
}
