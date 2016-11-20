(function() {
    angular
        .module('api')
        .filter('markup', markup);

    var converter = new showdown.Converter();

    function markup() {
        return function(input) {
        	var html = converter.makeHtml(input);
        	return html.slice(3, -4);
        };
    }
})();
