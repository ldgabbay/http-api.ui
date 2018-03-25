(function() {
    'use strict';

    angular
        .module('app')
        .filter('hapiMarkdown', hapiMarkdown);

    var converter = new showdown.Converter({
        'openLinksInNewWindow': true
    });

    hapiMarkdown.$inject = ['$sce'];

    function hapiMarkdown($sce) {
        return function(input) {
            if (!input)
                return '';
            var html = converter.makeHtml(input);
            html = $sce.trustAsHtml(html);
            return html;
        };
    }
})();
