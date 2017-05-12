var services = require('./services/httpService');
var codeHelpers = require('./services/codeHelpers');

module.exports = {
    route: {
        canReuse: false,
    },
    template: `
<div>
<div class="row">
    <h2>LiteApi Blog</h2>
    
    <div class="col-md-9" v-for="p in posts">
        <router-link :to="'/blog/' + p.formatedCreatedDate + '/' + p.id"><h3>{{ p.title }}</h3></router-link>
        <div v-html="p.shortHtml"></div>
        {{ p.formatedCreatedDate }} by {{ p.author }}
    </div>

</div>    
</div>`,
    data() {
        return {
            posts: []
        }
    },
    watch: {
        '$route': 'loadData'
    },
    created() {
        this.loadData();
    },
    methods: {
        loadData() {
            this.posts = [];
            $(window).scrollTop(0);
            
            services.blogService.getPage(1, (res) => {
                this.posts = JSON.parse(res);
                codeHelpers.highlight();
            });
        }
    }

}