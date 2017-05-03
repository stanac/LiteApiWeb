var services = require('./services/httpService');
var codeHelpers = require('./services/codeHelpers');

module.exports = {
    data() {
        return {
            html: 'loading...'
        }
    },
    template: '<div class="off-top row"><div v-html="html" class="col-md-12"></div></div>',
    created() {
        this.loadData();
    },
    methods: {
        loadData() {
            services.pageService.get('getting-started', (response) => {
                this.html = response;

                codeHelpers.highlight();
            });
        }
    }
};