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
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
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
	highlight: function highlight() {
		var innerHighlight = function innerHighlight(timeout) {
			timeout = timeout | 50;
			if (timeout > 2000) return;

			setTimeout(function () {
				if (Prism) Prism.highlightAll();else innerHighlight(timeout * 2);
			}, timeout);
		};
		innerHighlight(50);
	}
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    template: '<h2>LiteApi blog<h2> <div class="alert alert-info">  In development</div>'
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var services = __webpack_require__(0);
var highlighter = __webpack_require__(1);

module.exports = {
    template: '\n<div class="row off-top">\n    <div class="col-md-3">\n        index\n        <ul>\n            <template v-for="item in treeData">\n                <treeitem :model="item"></treeitem>\n            </template>\n        </ul>\n    </div>\n\n    <div v-html="docsHtml" class="col-md-9"></div>\n</div>',
    data: function data() {
        return {
            docsHtml: 'loading...',
            treeData: []
        };
    },
    created: function created() {
        this.loadData();
    },

    methods: {
        loadData: function loadData() {
            var _this = this;

            services.docsService.get('home', function (homeRes) {
                _this.docsHtml = homeRes;
                highlighter.highlight();
            });
            this.loadTree();
        },
        loadTree: function loadTree() {
            this.treeData = [{
                Page: {
                    Title: 'Root page 1 and id is 1'
                },
                Children: []
            }, {
                Page: {
                    Title: 'Root page 2 and id is 2'
                },
                Children: [{
                    Page: {
                        Title: 'Subpage and instalation 21'
                    },
                    Children: [{
                        Page: {
                            Title: 'Sublevel level number 3'
                        },
                        Children: []
                    }]
                }]
            }, {
                Page: {
                    Title: 'Root page 3 and i3'
                },
                Children: []
            }];
        }
    },

    components: {
        'treeitem': {
            props: ['model'],
            template: '\n<li>\n    {{ model.Page.Title }}\n</li>\n'
        }
    }
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var services = __webpack_require__(0);
var highlighter = __webpack_require__(1);

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

                highlighter.highlight();
            });
        }
    }
};

/***/ }),
/* 5 */
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _gettingStarted = __webpack_require__(4);

var GettingStarted = _interopRequireWildcard(_gettingStarted);

var _docs = __webpack_require__(3);

var Docs = _interopRequireWildcard(_docs);

var _home = __webpack_require__(5);

var Home = _interopRequireWildcard(_home);

var _blog = __webpack_require__(2);

var Blog = _interopRequireWildcard(_blog);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// Vue.extend(), or just a component options object.
// We'll talk about nested routes later.
// 0. If using a module system, call Vue.use(VueRouter)

// 1. Define route components.
// These can be imported from other files
var routes = [{ path: '/', component: Home }, { path: '/getting-started', component: GettingStarted }, { path: '/docs', component: Docs }, { path: '/blog', component: Blog }];

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
var router = new VueRouter({
    routes: routes
});

// 4. Create and mount the root instance.
// Make sure to inject the router with the router option to make the
// whole app router-aware.
var app = new Vue({
    router: router
}).$mount('#app');

/***/ })
/******/ ]);