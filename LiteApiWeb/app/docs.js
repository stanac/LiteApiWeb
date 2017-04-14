var services = require('./services/httpService');
var highlighter = require('./services/codeHighlighter');

module.exports = {
    template: `
<script type="text/x-template" id="item-template">
  <li>
    <div v-if="model.Page">
      {{model.Page.Title}}
    </div>
    <ul v-show="open" v-if="model.Children.length">
      <item
        v-for="model in model.Children"
        :model="model">
      </item>
    </ul>
  </li>
</script>

<div class="row">
<div v-html="side" class="col-md-3"></div>
<div v-html="html" class="col-md-9"></div>
</div>`,
    data() {
        return {
            side: 'loading...',
            html: 'loading...',
            model: { Children: [], Page: { Title: "123" } }
        }
    },
    created() {
        this.loadData();
    },
    methods: {
        loadData() {
            services.docsService.get('home', (homeRes) => {
                this.html = homeRes;

                highlighter.highlight();

            });
            this.showIndex();
        },

        showIndex() {
            services.docsService.get('index.json', (response) => {
                var data = JSON.parse(response).filter(x => x.Page.Id !== 'home');
                this.model = { Children: data, Title: "123" };
            });
        }
    }
}