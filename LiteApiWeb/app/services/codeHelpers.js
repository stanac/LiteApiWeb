module.exports = {
    highlight: function () {
        var fixLinks = function () {
            $('.user-content a').filter(function () {
                return ($(this).attr('id') || '').indexOf('pragma-line') === -1
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

		var innerHighlight = function (timeout) {
			timeout = timeout | 50;
			if (timeout > 2000) return;

			setTimeout(function () {
				if (Prism) Prism.highlightAll();
				else innerHighlight(timeout * 2);
			}, timeout);
        };

        var innerTable = function (timeout) {
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
        }

        innerHighlight(50);
        innerTable(50);
	}
}