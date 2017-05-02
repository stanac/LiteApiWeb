var services = require('./services/httpService');
// var codeHelpers = require('./services/codeHelpers');

module.exports = {
    data() {
        return {
            model: [],
            error: '',
            loading: true
        }
    },
    template: `
<div class="off-top row">
<div v-if='error' class="alert alert-warning">
    {{ error }}
</div>

<p>
Search for: <strong>{{ $route.params.query }}</strong>
</p>

<div v-if='loading'>
<div class="spinner">
  <div class="rect1"></div>
  <div class="rect2"></div>
  <div class="rect3"></div>
  <div class="rect4"></div>
  <div class="rect5"></div>
</div>
</div>
<div v-else>
<div v-if='model.length === 0' class='alert alert-info'>
Your search didn’t return any results
</div>
</div>

<ul>
<li v-for="item in model">
     <router-link :to="'/docs/' + item.id">{{ item.title }}</router-link>
</li>
</ul>
</div>`,
    created() {
        this.loadData();
    },
    watch: {
        '$route': 'loadData'
    },
    methods: {
        loadData() {
            this.loading = true;
            var query = this.$route.params.query || '';
            services.docsService.search(query, (response) => {
                this.model = [];
                this.error = '';
                if (response.error) {
                    this.error = response.error;
                } else {
                    this.model = response;
                }
                this.loading = false;
                // codeHelpers.highlight();
            });
        }
    }
};