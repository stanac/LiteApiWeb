var PageService = function () {
    var appVersion = "?v=" + window.appVersion;
    this.get = function(name, callback) {
        nanoajax.ajax({
            method: 'GET',
            url: '/content/pages/' + name + '.html' + appVersion
        }, function (code, responseText, request) {
            callback(responseText);
        });
    }
};

var DocsService = function () {
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
            url: '/api/docs/search/' + encodeURIComponent(query) + appVersion
        }, function (code, responseText, request) {
            callback(JSON.parse(responseText));
        });
    };
};

var BlogService = function () {
    var appVersion = "?v=" + window.appVersion;
    this.getPage = function (pageNum, callback) {
        nanoajax.ajax({
            method: 'GET',
            url: '/api/blog/page/' + pageNum + appVersion
        }, function (code, responseText, request) {
            callback(responseText);
        });
    }

    this.getPost = function (id, callback) {
        nanoajax.ajax({
            method: 'GET',
            url: '/api/blog/' + id + appVersion
        }, function (code, responseText, request) {
            callback(responseText);
        });
    }
};

var pageService = new PageService();
var docsService = new DocsService();
var blogService = new BlogService();

module.exports = { pageService, docsService, blogService };