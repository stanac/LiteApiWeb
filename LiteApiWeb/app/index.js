// 0. If using a module system, call Vue.use(VueRouter)

import * as GettingStarted from './gettingStarted'
import * as Docs from './docs'
import * as Home from './home'
import * as Blog from './blog'
import * as DocsSearch from './docsSearch'
import * as ApiDocs from './apiDocs'

const routes = [
    { path: '/', component: Home },
    { path: '/getting-started', component: GettingStarted },
    { path: '/docs/:id?', component: Docs },
    { path: '/search/docs/:query', component: DocsSearch },
    { path: '/blog', component: Blog },
    { path: '/api-docs', component: ApiDocs }
]

const router = new VueRouter({
    routes,
    mode: 'history'
})

window.vueRouter = router;

const app = new Vue({
  router
}).$mount('#app')

function initSearch(timeout) {
    if (timeout > 5000) {
        return;
    }
    if (window.$) {
        var input = $('#navbar form input');
        input.keypress(function (e) {
            if (e.which == 13) {
                var query = input.val();
                window.vueRouter.push('/search/docs/' + (query || ' '));
                return false; 
            }
        });
    } else {
        setTimeout(function () {
            initSearch(timeout * 2);
        }, timeout);
    }
}
initSearch(50);