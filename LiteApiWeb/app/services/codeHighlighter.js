module.exports = {
	highlight: function () {
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
                } else {
                    innerTable(timeout * 2);
                }
            }, timeout);
        }

        innerHighlight(50);
        innerTable(50);
	}
}