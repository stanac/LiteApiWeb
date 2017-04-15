var services = require('./services/httpService');
var highlighter = require('./services/codeHighlighter');

module.exports = {
    template: `
<div class="row off-top">
    <div class="col-md-3">
        <ul class="treeListRoot">
            <template v-for="item in treeData">
                <treeitem :model="item"></treeitem>
            </template>
        </ul>
    </div>

    <div v-html="docsHtml" class="col-md-9"></div>
</div>`,
    data() {
        return {
            docsHtml: 'loading...',
            treeData: []
        }
    },
    created() {
        this.loadData();
    },
    methods: {
        loadData() {
            services.docsService.get('home', (homeRes) => {
                this.docsHtml = homeRes;
                highlighter.highlight();
            });
            this.loadTree();
        },

        loadTree() {
            services.docsService.get('index.json', response => {
                var data = JSON.parse(response).filter(x => x.Page.Id !== "home");
                this.treeData = data;
            });
        }
    },

    components: {
        'treeitem': {
            props: ['model'],
            template: `
<!-- TODO change to use recursive template -->
<li>
    <a :href="'#/docs/' + model.Page.Id">{{ model.Page.Title }}</a>
    <ul v-if="model.Children.length" class="treeList">
        <li v-for="sub in model.Children" class="treeListItem">
            <a :href="'#/docs/' + sub.Page.Id">{{ sub.Page.Title }}</a>
           <ul v-if="sub.Children.length"  class="treeList">
             <li v-for="sub2 in sub.Children" class="treeListItem">
                <a :href="'#/docs/' + sub2.Page.Id">{{ sub2.Page.Title }}</a>
                <ul v-if="sub2.Children.length" class="treeList">
                  <li v-for="sub3 in sub2.Children" class="treeListItem">
                    <a :href="'#/docs/' + sub3.Page.Id">{{ sub3.Page.Title }}</a>
                      <ul v-if="sub3.Children.length" class="treeList">
                        <li v-for="sub4 in sub3.Children" class="treeListItem">
                          <a :href="'#/docs/' + sub4.Page.Id">{{ sub4.Page.Title }}</a>
                        </li>
                      </ul>
                  </li>
                </ul>
             </li>
           </ul>
        </li>
    </ul>
</li>
`
        }
    }
}