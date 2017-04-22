/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var PageService = function PageService() {
    this.get = function (name, callback) {
        nanoajax.ajax({
            method: 'GET',
            url: '/content/pages/' + name + '.html'
        }, function (code, responseText, request) {
            callback(responseText);
        });
    };
};

var DocsService = function DocsService() {
    this.get = function (name, callback) {
        if (!name.endsWith('.html') && !name.endsWith('.json')) {
            name += '.html';
        }
        nanoajax.ajax({
            method: 'GET',
            url: '/content/docs/' + name
        }, function (code, responseText, request) {
            callback(responseText);
        });
    };
};

var pageService = new PageService();
var docsService = new DocsService();

module.exports = { pageService: pageService, docsService: docsService };

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    template: '<h2>LiteApi blog<h2> <div class="alert alert-info">  In development</div>'
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var services = __webpack_require__(0);
var codeHelpers = __webpack_require__(6);

module.exports = {
    route: {
        canReuse: false
    },
    template: '\n<div class="row off-top">\n    <div class="col-md-3">\n        <ul class="treeListRoot">\n            <template v-for="item in treeData">\n                <treeitem :model="item"></treeitem>\n            </template>\n        </ul>\n    </div>\n\n    <div v-html="docsHtml" class="col-md-9"></div>\n</div>',
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var services = __webpack_require__(0);
var codeHelpers = __webpack_require__(6);

module.exports = {
    data: function data() {
        return {
            html: 'loading...'
        };
    },

    template: '<div class="off-top row" v-html="html"></div>',
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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var services = __webpack_require__(0);

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

                setTimeout(function (_) {
                    _this.isLoading = false;
                }, 1500);
            });
        }
    }
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _gettingStarted = __webpack_require__(3);

var GettingStarted = _interopRequireWildcard(_gettingStarted);

var _docs = __webpack_require__(2);

var Docs = _interopRequireWildcard(_docs);

var _home = __webpack_require__(4);

var Home = _interopRequireWildcard(_home);

var _blog = __webpack_require__(1);

var Blog = _interopRequireWildcard(_blog);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// 0. If using a module system, call Vue.use(VueRouter)

var routes = [{ path: '/', component: Home }, { path: '/getting-started', component: GettingStarted }, { path: '/docs/:id?', component: Docs },
// { path: '/docs/:id', component: Docs },
//{ path: '/docs', component: Docs },
{ path: '/blog', component: Blog }];

var router = new VueRouter({
    routes: routes,
    mode: 'history'
});

window.vueRouter = router;

var app = new Vue({
    router: router
}).$mount('#app');

/***/ }),
/* 6 */
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

/***/ })
/******/ ]);