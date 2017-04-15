var services = require('./services/httpService');
var highlighter = require('./services/codeHighlighter');

module.exports = {
    template: `
<div class="row off-top">
    <div class="col-md-3">
        index
        <ul>
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
            this.treeData = [{
                Page: {
                    Title: 'Root page 1 and id is 1'
                },
                Children: []
            }, {
                Page: {
                    Title: 'Root page 2 and id is 2'
                },
                Children: [{
                    Page: {
                        Title: 'Subpage and instalation 21'
                    },
                    Children: [{
                        Page: {
                            Title: 'Sublevel level number 3'
                        },
                        Children: []
                    }]
                }]
            }, {
                Page: {
                    Title: 'Root page 3 and i3'
                },
                Children: []
            }];

        }
    },

    components: {
        'treeitem': {
            props: ['model'],
            template: `
<li>
    {{ model.Page.Title }}
</li>
`
        }
    }
}