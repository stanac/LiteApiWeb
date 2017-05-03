var services = require('./services/httpService');
var codeHelpers = require('./services/codeHelpers');

module.exports = {
    route: {
        canReuse: false,
    },
    template: `
<div>

    <div v-html="docsHtml" class="col-md-9  col-md-push-3"></div>

    <div class="col-md-3 col-md-pull-9" style="margin-top:28px">
        <ul class="treeListRoot">
            <li class="treeListItem">
                <router-link to="/api-docs/">API documentation (in development)</router-link>
            </li>
            <template v-for="item in treeData">
                <treeitem :model="item"></treeitem>
            </template>
        </ul>
    </div>

    
</div>`,
    data() {
        return {
            docsHtml: 'loading...',
            treeData: [],
        }
    },
    watch: {
        '$route': 'loadData'
    },
    created() {
        this.loadData();
        this.loadTree();
    },
    methods: {
        loadData() {
            this.docsHtml = '';
            $(window).scrollTop(0);
            var id = 'home';
            if (this.$route.params.id) {
                id = this.$route.params.id;
            }
            services.docsService.get(id, (res) => {
                this.docsHtml = res;
                codeHelpers.highlight();
            });
        },

        loadTree() {
            services.docsService.get('index.json', response => {
                var data = JSON.parse(response).filter(x => x.Page.Id !== "home");
                this.treeData = data;
            });
        },

        watchIdChange() {
            
        }
    },

    components: {
        'treeitem': {
            props: ['model'],
            template: `
<!-- TODO change to use recursive template -->
<li>
    <router-link :to="'/docs/' + model.Page.Id">{{ model.Page.Title }}</router-link>
    <ul v-if="model.Children.length" class="treeList">
        <li v-for="sub in model.Children" class="treeListItem">
            <router-link :to="'/docs/' + sub.Page.Id">{{ sub.Page.Title }}</router-link>
           <ul v-if="sub.Children.length"  class="treeList">
             <li v-for="sub2 in sub.Children" class="treeListItem">
                <router-link :to="'/docs/' + sub2.Page.Id">{{ sub2.Page.Title }}</router-link>
                <ul v-if="sub2.Children.length" class="treeList">
                  <li v-for="sub3 in sub2.Children" class="treeListItem">
                    <router-link :to="'/docs/' + sub3.Page.Id">{{ sub3.Page.Title }}</router-link>
                      <ul v-if="sub3.Children.length" class="treeList">
                        <li v-for="sub4 in sub3.Children" class="treeListItem">
                          <router-link :to="'/docs/' + sub4.Page.Id">{{ sub4.Page.Title }}</router-link>
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