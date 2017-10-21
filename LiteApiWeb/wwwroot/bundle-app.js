/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var PageService = function PageService() {
    var appVersion = "?v=" + window.appVersion;
    this.get = function (name, callback) {
        nanoajax.ajax({
            method: 'GET',
            url: '/content/pages/' + name + '.html' + appVersion
        }, function (code, responseText, request) {
            callback(responseText);
        });
    };
};

var DocsService = function DocsService() {
    var appVersion = "?v=" + window.appVersion;
    this.get = function (name, callback) {
        if (!name.endsWith('.html') && !name.endsWith('.json')) {
            name += '.html';
        }
        nanoajax.ajax({
            method: 'GET',
            url: '/content/docs/' + name + appVersion
        }, function (code, responseText, request) {
            callback(responseText);
        });
    };
    this.search = function (query, callback) {
        query = query.trim();
        var error = {
            error: 'Search term(s) needs to have at lease 3 characters'
        };
        if (query.length < 3) {
            callback(error);
            return;
        }
        //var words = query.split(' ');
        //for (let w of words) {
        //    if (w.length < 3) {
        //        callback(error);
        //        return;
        //    }
        //}
        nanoajax.ajax({
            method: 'GET',
            url: '/api/docs/search/' + encodeURIComponent(query) + appVersion
        }, function (code, responseText, request) {
            callback(JSON.parse(responseText));
        });
    };
};

var BlogService = function BlogService() {
    var appVersion = "?v=" + window.appVersion;
    this.getPage = function (pageNum, callback) {
        nanoajax.ajax({
            method: 'GET',
            url: '/api/blog/page/' + pageNum + appVersion
        }, function (code, responseText, request) {
            callback(responseText);
        });
    };

    this.getPost = function (id, callback) {
        nanoajax.ajax({
            method: 'GET',
            url: '/api/blog/' + id + appVersion
        }, function (code, responseText, request) {
            callback(responseText);
        });
    };
};

var pageService = new PageService();
var docsService = new DocsService();
var blogService = new BlogService();

module.exports = { pageService: pageService, docsService: docsService, blogService: blogService };

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    highlight: function highlight() {
        var fixLinks = function fixLinks() {
            $('.user-content a').filter(function () {
                return ($(this).attr('id') || '').indexOf('pragma-line') === -1;
            }).on('click', function () {
                if ($(this)[0].host === window.location.host) {
                    // vueRuter.push();
                    var link = $(this).attr('href');
                    console.log('prevent: ' + link);
                    vueRouter.push(link);
                    return false;
                }
            });
        };

        var innerHighlight = function innerHighlight(timeout) {
            timeout = timeout | 50;
            if (timeout > 2000) return;

            setTimeout(function () {
                if (Prism) Prism.highlightAll();else innerHighlight(timeout * 2);
            }, timeout);
        };

        var innerTable = function innerTable(timeout) {
            timeout = timeout | 50;
            if (timeout > 2000) return;

            setTimeout(function () {
                if (window.$) {
                    $('.user-content table').addClass('table table-stripped');
                    fixLinks();
                } else {
                    innerTable(timeout * 2);
                }
            }, timeout);
        };

        innerHighlight(50);
        innerTable(50);
    }
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    template: "\n<div class=\"row off-top\">\n<div class=\"col-md-12\">\n    <h2>API documentation<h2> <div class=\"alert alert-info\">In development</div>\n</div>\n</div>"
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var services = __webpack_require__(0);
var codeHelpers = __webpack_require__(1);

module.exports = {
    route: {
        canReuse: false
    },
    template: '\n<div>\n<div class="row">\n    <h2>LiteApi Blog</h2>\n    \n    <div class="col-md-9" v-for="p in posts">\n        <router-link :to="\'/blog/\' + p.formatedCreatedDate + \'/\' + p.id"><h3>{{ p.title }}</h3></router-link>\n        <div v-html="p.shortHtml"></div>\n        {{ p.formatedCreatedDate }} by {{ p.author }}\n    </div>\n\n</div>    \n</div>',
    data: function data() {
        return {
            posts: []
        };
    },

    watch: {
        '$route': 'loadData'
    },
    created: function created() {
        this.loadData();
    },

    methods: {
        loadData: function loadData() {
            var _this = this;

            this.posts = [];
            $(window).scrollTop(0);

            services.blogService.getPage(1, function (res) {
                _this.posts = JSON.parse(res);
                codeHelpers.highlight();
            });
        }
    }

};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var services = __webpack_require__(0);
var codeHelpers = __webpack_require__(1);

module.exports = {
	route: {
		canReuse: false
	},
	template: '\n\t\t<div class="row off-top" v-if="post">\n\t\t\t<div class="col-md-12"><h2>{{ post.title }}</h2></div>\n\t\t\t<div class="col-md-12">{{ post.formatedCreatedDate }} by {{ post.author }}</div>\n\t\t\t<div class ="col-md-12">\n\t\t\t\t<br/><br/>\n\t\t\t</div>\n\t\t\t<div class="col-md-12" v-html="post.contentHtml"></div>\n\t\t</div>\n',
	data: function data() {
		return {
			post: null
		};
	},

	watch: {
		'$route': 'loadData'
	},
	created: function created() {
		this.loadData();
	},

	methods: {
		loadData: function loadData() {
			var _this = this;

			this.post = null;
			$(window).scrollTop(0);
			var id = this.$route.params.id;
			services.blogService.getPost(id, function (res) {
				_this.post = JSON.parse(res);
				codeHelpers.highlight();
			});
		}
	}

};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var services = __webpack_require__(0);
var codeHelpers = __webpack_require__(1);

module.exports = {
    route: {
        canReuse: false
    },
    template: '\n<div>\n\n    <div v-html="docsHtml" class="col-md-9  col-md-push-3"></div>\n\n    <div class="col-md-3 col-md-pull-9" style="margin-top:28px">\n        <ul class="treeListRoot">\n            <li class="treeListItem">\n                <router-link to="/api-docs/">API documentation (in development)</router-link>\n            </li>\n            <template v-for="item in treeData">\n                <treeitem :model="item"></treeitem>\n            </template>\n        </ul>\n    </div>\n\n    \n</div>',
    data: function data() {
        return {
            docsHtml: 'loading...',
            treeData: []
        };
    },

    watch: {
        '$route': 'loadData'
    },
    created: function created() {
        this.loadData();
        this.loadTree();
    },

    methods: {
        loadData: function loadData() {
            var _this = this;

            this.docsHtml = '';
            $(window).scrollTop(0);
            var id = 'home';
            if (this.$route.params.id) {
                id = this.$route.params.id;
            }
            services.docsService.get(id, function (res) {
                _this.docsHtml = res;
                codeHelpers.highlight();
            });
        },
        loadTree: function loadTree() {
            var _this2 = this;

            services.docsService.get('index.json', function (response) {
                var data = JSON.parse(response).filter(function (x) {
                    return x.Page.Id !== "home";
                });
                _this2.treeData = data;
            });
        },
        watchIdChange: function watchIdChange() {}
    },

    components: {
        'treeitem': {
            props: ['model'],
            template: '\n<!-- TODO change to use recursive template -->\n<li>\n    <router-link :to="\'/docs/\' + model.Page.Id">{{ model.Page.Title }}</router-link>\n    <ul v-if="model.Children.length" class="treeList">\n        <li v-for="sub in model.Children" class="treeListItem">\n            <router-link :to="\'/docs/\' + sub.Page.Id">{{ sub.Page.Title }}</router-link>\n           <ul v-if="sub.Children.length"  class="treeList">\n             <li v-for="sub2 in sub.Children" class="treeListItem">\n                <router-link :to="\'/docs/\' + sub2.Page.Id">{{ sub2.Page.Title }}</router-link>\n                <ul v-if="sub2.Children.length" class="treeList">\n                  <li v-for="sub3 in sub2.Children" class="treeListItem">\n                    <router-link :to="\'/docs/\' + sub3.Page.Id">{{ sub3.Page.Title }}</router-link>\n                      <ul v-if="sub3.Children.length" class="treeList">\n                        <li v-for="sub4 in sub3.Children" class="treeListItem">\n                          <router-link :to="\'/docs/\' + sub4.Page.Id">{{ sub4.Page.Title }}</router-link>\n                        </li>\n                      </ul>\n                  </li>\n                </ul>\n             </li>\n           </ul>\n        </li>\n    </ul>\n</li>\n'
        }
    }
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var services = __webpack_require__(0);
// var codeHelpers = require('./services/codeHelpers');

module.exports = {
    data: function data() {
        return {
            model: [],
            error: '',
            loading: true
        };
    },

    template: '\n<div class="off-top row">\n<div class="col-md-12">\n<div v-if=\'error\' class="alert alert-warning">\n    {{ error }}\n</div>\n\n<p>\nSearch for: <strong>{{ $route.params.query }}</strong>\n</p>\n\n<div v-if=\'loading\'>\n<div class="spinner">\n  <div class="rect1"></div>\n  <div class="rect2"></div>\n  <div class="rect3"></div>\n  <div class="rect4"></div>\n  <div class="rect5"></div>\n</div>\n</div>\n<div v-else>\n<div v-if=\'model.length === 0\' class=\'alert alert-info\'>\nYour search didn\u2019t return any results\n</div>\n</div>\n\n<ul>\n<li v-for="item in model">\n     <router-link :to="\'/docs/\' + item.id">{{ item.title }}</router-link>\n</li>\n</ul>\n</div>\n</div>',
    created: function created() {
        this.loadData();
    },

    watch: {
        '$route': 'loadData'
    },
    methods: {
        loadData: function loadData() {
            var _this = this;

            this.loading = true;
            var query = this.$route.params.query || '';
            services.docsService.search(query, function (response) {
                _this.model = [];
                _this.error = '';
                if (response.error) {
                    _this.error = response.error;
                } else {
                    _this.model = response;
                }
                _this.loading = false;
                // codeHelpers.highlight();
            });
        }
    }
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var services = __webpack_require__(0);
var codeHelpers = __webpack_require__(1);

module.exports = {
    data: function data() {
        return {
            html: 'loading...'
        };
    },

    template: '<div class="off-top row"><div v-html="html" class="col-md-12"></div></div>',
    created: function created() {
        this.loadData();
    },

    methods: {
        loadData: function loadData() {
            var _this = this;

            services.pageService.get('getting-started', function (response) {
                _this.html = response;

                codeHelpers.highlight();
            });
        }
    }
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var services = __webpack_require__(0);
var codeHelpers = __webpack_require__(1);

module.exports = {
    data: function data() {
        return {
            html: 'loading...'
        };
    },

    template: '\n<div>\n    <div class="off-top" v-html="html"></div>\n</div>',
    created: function created() {
        this.loadData();
    },

    methods: {
        loadData: function loadData() {
            var _this = this;

            services.pageService.get('home', function (response) {
                _this.html = response;
                codeHelpers.highlight();
            });
        }
    }
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

!function(e,n){if(true)module.exports=n();else if("function"==typeof define&&define.amd)define([],n);else{var t=n();for(var o in t)("object"==typeof exports?exports:e)[o]=t[o]}}(this,function(){return function(e){function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}var t={};return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:o})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},n.p="",n(n.s=0)}([function(e,n,t){"use strict";function o(e){return e.replace(/-/gi,"")}function r(){return[].concat(R.id)}function a(e,n){var t=o(n);return r().length>1?t+"."+e:e}function i(){return"undefined"==typeof window}function u(e){return A(I,e)}function c(e){for(var n=arguments.length,t=Array(n>1?n-1:0),o=1;o<n;o++)t[o-1]=arguments[o];i()||void 0===window.ga||r().forEach(function(n){var o;(o=window).ga.apply(o,[a(e,n)].concat(t))})}function l(e){var n=Object.keys(e).reduce(function(n,t,o,r){return n+=t+"="+e[t],o<r.length-1&&(n+="&"),n},"?");return"?"===n?"":n}function f(e,n){if(!e)return void T("Is not possible to track the current route without VueRouter installed");var t=e.currentRoute,o={page:t.path+l(t.query),title:t.name,location:window.location.href};return"function"==typeof n[1]&&(o.hitCallback=n[1]),o}function s(){if(!i()){for(var e=arguments.length,n=Array(e),t=0;t<e;t++)n[t]=arguments[t];var o=n[0];if("string"!=typeof o&&"currentRoute"in o)return void c("send","pageview",f(o,n));c.apply(void 0,["send","pageview"].concat(n))}}function d(){if(!i()&&void 0!==window.ga){for(var e=arguments.length,n=Array(e),t=0;t<e;t++)n[t]=arguments[t];if(n.length)return"object"==typeof n[0]&&n[0].constructor===Object?void c("set",n[0]):n.length<2||"string"!=typeof n[0]&&"string"!=typeof n[1]?void T("$ga.set needs a field name and a field value, or you can pass an object literal"):void c("set",n[0],n[1])}}function p(e,n){var t=n.currentRoute,o=e?e(n.currentRoute):n;O(t.name)||(d("page",t.path),s(o,n))}function g(e){if(R.autoTracking.page&&e){var n=R.autoTracking.pageviewTemplate;R.autoTracking.pageviewOnLoad&&p(n,e),e.afterEach(function(){setTimeout(function(){p(n,e)},0)})}}function v(e){c("send","exception",{exDescription:e,exFatal:arguments.length>1&&void 0!==arguments[1]&&arguments[1]})}function y(){R.autoTracking.exception&&!i()&&(window.onerror=function(e){return v(e.message||e)})}function h(){for(var e=arguments.length,n=Array(e),t=0;t<e;t++)n[t]=arguments[t];c.apply(void 0,["send","event"].concat(n))}function w(){for(var e=arguments.length,n=Array(e),t=0;t<e;t++)n[t]=arguments[t];c.apply(void 0,["send","timing"].concat(n))}function b(){c.apply(void 0,arguments)}function m(){for(var e=arguments.length,n=Array(e),t=0;t<e;t++)n[t]=arguments[t];c.apply(void 0,["send","social"].concat(n))}function k(e){c("require",e)}function x(e,n){if(!i()){if(!R.id||!R.id.length){return void T("Please enter a Google Analaytics tracking ID","https://github.com/MatteoGabriele/vue-analytics#usage")}var t={},a=R.linkers.length>0,u=R.debug.enabled?"_debug":"",c="https://www.google-analytics.com/analytics"+u+".js";R.userId&&(t=L({},t,{userId:R.userId})),a&&(t=L({},t,{allowLinker:!0})),q()(c,function(i,u){if(i)return void T("Ops! Is not possible to load Google Analytics script");E().then(function(){R.debug.enabled&&(window.ga_debug={trace:R.debug.trace});var i=r();i.forEach(function(e){i.length>1&&(t.name=o(e)),window.ga("create",e,"auto",t),a&&(window.ga("require","linker"),window.ga("linker:autoLink",R.linkers))}),n&&"function"==typeof n&&n(),R.debug.sendHitTask||P.set("sendHitTask",null),P.autoTrackException(),P.autoTrackPage(e)})})}}function j(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},t=n.router;delete n.router,u(n),x(t,n.onReady),e.prototype.$ga=e.$ga=P}Object.defineProperty(n,"__esModule",{value:!0});var T=function(){for(var e=arguments.length,n=Array(e),t=0;t<e;t++)n[t]=arguments[t];console.warn("[VueAnalytics] "+n.join(" "))},O=function(e){return!(!R.ignoreRoutes.length||-1===R.ignoreRoutes.indexOf(e))},A=function e(n,t){return Object.keys(t).forEach(function(o){if(n[o]&&"object"==typeof n[o])return void e(n[o],t[o]);n[o]=t[o]}),n},E=function(){return new Promise(function(e,n){var t=setInterval(function(){!i()&&window.ga&&(clearInterval(t),e())},10)})},I={debug:{enabled:!1,trace:!1,sendHitTask:!0},autoTracking:{exception:!1,page:!0,pageviewOnLoad:!0,pageviewTemplate:null},id:null,userId:null,ignoreRoutes:[],linkers:[]},R=I,P={autoTrackPage:g,autoTrackException:y,social:m,page:s,event:h,time:w,exception:v,set:d,query:b,require:k},_=t(1),q=t.n(_),L=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])}return e};n.default={install:j,generateMethodName:a,onScriptLoaded:E}},function(e,n){function t(e,n){for(var t in n)e.setAttribute(t,n[t])}function o(e,n){e.onload=function(){this.onerror=this.onload=null,n(null,e)},e.onerror=function(){this.onerror=this.onload=null,n(new Error("Failed to load "+this.src),e)}}function r(e,n){e.onreadystatechange=function(){"complete"!=this.readyState&&"loaded"!=this.readyState||(this.onreadystatechange=null,n(null,e))}}e.exports=function(e,n,a){var i=document.head||document.getElementsByTagName("head")[0],u=document.createElement("script");"function"==typeof n&&(a=n,n={}),n=n||{},a=a||function(){},u.type=n.type||"text/javascript",u.charset=n.charset||"utf8",u.async=!("async"in n)||!!n.async,u.src=e,n.attrs&&t(u,n.attrs),n.text&&(u.text=""+n.text),("onload"in u?o:r)(u,a),u.onload||o(u,a),i.appendChild(u)}}])});

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _gettingStarted = __webpack_require__(7);

var GettingStarted = _interopRequireWildcard(_gettingStarted);

var _docs = __webpack_require__(5);

var Docs = _interopRequireWildcard(_docs);

var _home = __webpack_require__(8);

var Home = _interopRequireWildcard(_home);

var _blog = __webpack_require__(3);

var Blog = _interopRequireWildcard(_blog);

var _blogPost = __webpack_require__(4);

var BlogPost = _interopRequireWildcard(_blogPost);

var _docsSearch = __webpack_require__(6);

var DocsSearch = _interopRequireWildcard(_docsSearch);

var _apiDocs = __webpack_require__(2);

var ApiDocs = _interopRequireWildcard(_apiDocs);

var _vueAnalytics = __webpack_require__(9);

var _vueAnalytics2 = _interopRequireDefault(_vueAnalytics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// 0. If using a module system, call Vue.use(VueRouter)

var routes = [{ path: '/', component: Home }, { path: '/getting-started', component: GettingStarted }, { path: '/docs/:id?', component: Docs }, { path: '/search/docs/:query', component: DocsSearch }, { path: '/blog', component: Blog }, { path: '/blog/:date/:id', component: BlogPost }, { path: '/api-docs', component: ApiDocs }];

var router = new VueRouter({
    routes: routes,
    mode: 'history'
});

window.vueRouter = router;

Vue.use(_vueAnalytics2.default, {
    id: 'UA-105330561-1',
    router: router
});

var app = new Vue({
    router: router
}).$mount('#app');

function initSearch(timeout) {
    if (timeout > 5000) {
        return;
    }
    if (window.$) {
        var input = $('#navbar form input');
        input.keypress(function (e) {
            if (e.which == 13) {
                var query = input.val();
                $('.navbar-collapse').collapse('hide');
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

/***/ })
/******/ ]);