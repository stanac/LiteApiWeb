var services = require('./services/httpService');

module.exports = {
    data() {
        return {
            html: 'loading...'
        }
    },
    template: '<div class="off-top" v-html="html"></div>',
    created() {
        this.loadData();
    },
    methods: {
        loadData() {
            services.pageService.get('home', (response) => {
                this.html = response;
            });
        }
    }
};