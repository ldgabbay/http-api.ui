(function() {
    angular
        .module('api')
        .filter('markup', markup);

    var converter = new showdown.Converter();

    function markup() {
        return function(input) {
            if (!input)
                return '';
        	var html = converter.makeHtml(input);
            return html;
        };
    }
})();
