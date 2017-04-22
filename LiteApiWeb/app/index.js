// 0. If using a module system, call Vue.use(VueRouter)

import * as GettingStarted from './gettingStarted'
import * as Docs from './docs'
import * as Home from './home'
import * as Blog from './blog'

const routes = [
    { path: '/', component: Home },
    { path: '/getting-started', component: GettingStarted },
    { path: '/docs/:id?', component: Docs },
    // { path: '/docs/:id', component: Docs },
    //{ path: '/docs', component: Docs },
    { path: '/blog', component: Blog }
]

const router = new VueRouter({
    routes,
    mode: 'history'
})

const app = new Vue({
  router
}).$mount('#app')
