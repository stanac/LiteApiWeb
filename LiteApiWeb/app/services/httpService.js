﻿var PageService = function () {
    this.get = function(name, callback) {
        nanoajax.ajax({
            method: 'GET',
            url: '/content/pages/' + name + '.html'
        }, function (code, responseText, request) {
            callback(responseText);
        });
    }
};

var DocsService = function () {
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
    this.search = function (query, callback) {
        query = query.trim();
        var error = {
            error: 'Search term(s) needs to have at lease 3 characters'
        }
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
            url: '/api/docs/search/' + encodeURIComponent(query)
        }, function (code, responseText, request) {
            callback(JSON.parse(responseText));
        });
    };
};

var pageService = new PageService();
var docsService = new DocsService();

module.exports = { pageService, docsService };