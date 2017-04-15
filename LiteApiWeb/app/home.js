var services = require('./services/httpService');

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

                setTimeout(_ => {
                    this.isLoading = false;
                }, 1500);
            });
        }
    }
};