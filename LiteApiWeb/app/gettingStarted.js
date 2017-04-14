var services = require('./services/httpService');
var highlighter = require('./services/codeHighlighter');

module.exports = {
    data() {
        return {
            html: 'loading...'
        }
    },
    template: '<div class="off-top row" v-html="html"></div>',
    created() {
        this.loadData();
    },
    methods: {
        loadData() {
            services.pageService.get('getting-started', (response) => {
                this.html = response;

                highlighter.highlight();
            });
        }
    }
};