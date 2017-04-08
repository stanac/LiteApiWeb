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

var pageService = new PageService();

module.exports = { pageService };