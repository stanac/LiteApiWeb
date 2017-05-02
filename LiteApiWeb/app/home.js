var services = require('./services/httpService');
var codeHelpers = require('./services/codeHelpers');

module.exports = {
    data() {
        return {
            html: 'loading...'
        }
    },
    template: `
<div>
    <div class="off-top" v-html="html"></div>
</div>`,
    created() {
        this.loadData();
    },
    methods: {
        loadData() {
            services.pageService.get('home', (response) => {
                this.html = response;
                codeHelpers.highlight();
            });
        }
    }
};