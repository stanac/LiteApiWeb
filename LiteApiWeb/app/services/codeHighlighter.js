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
		innerHighlight(50);
	}
}