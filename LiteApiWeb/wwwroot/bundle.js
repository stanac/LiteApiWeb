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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__gettingStarted__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__gettingStarted___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__gettingStarted__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__docs__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__docs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__docs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__home__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__home___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__home__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__blog__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__blog___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__blog__);
// 0. If using a module system, call Vue.use(VueRouter)

// 1. Define route components.
// These can be imported from other files





// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// Vue.extend(), or just a component options object.
// We'll talk about nested routes later.
const routes = [
  { path: '/', component: __WEBPACK_IMPORTED_MODULE_2__home__ },
  { path: '/getting-started', component: __WEBPACK_IMPORTED_MODULE_0__gettingStarted__ },
  { path: '/docs', component: __WEBPACK_IMPORTED_MODULE_1__docs__ },
  { path: '/blog', component: __WEBPACK_IMPORTED_MODULE_3__blog__ }
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
    routes
})

// 4. Create and mount the root instance.
// Make sure to inject the router with the router option to make the
// whole app router-aware.
const app = new Vue({
  router
}).$mount('#app')


/***/ }),
/* 2 */,
/* 3 */
/***/ (function(module, exports) {

﻿module.exports = {
    template: '<h2>LiteApi <small>ASPNET Core midleware, alternative to WebAPI</small></h2>'
}

/***/ }),
/* 4 */
/***/ (function(module, exports) {

﻿module.exports = {
    template: '<h2>Getting started</h2>'
}

/***/ }),
/* 5 */
/***/ (function(module, exports) {

﻿module.exports = {
    template: '<h2>Docs</h2>'
}

/***/ }),
/* 6 */
/***/ (function(module, exports) {

﻿module.exports = {
    template: `
<h2>LiteApi blog<h2>
<div class="alert alert-info">
    In development
</div>
`
}

/***/ })
/******/ ]);