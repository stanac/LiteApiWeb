var PageService = function () {
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
    }
};

var pageService = new PageService();
var docsService = new DocsService();

module.exports = { pageService, docsService };