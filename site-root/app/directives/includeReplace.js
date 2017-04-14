(function() {
    'use strict';

    angular
        .module('app')
        .directive('includeReplace', includeReplace);

    function includeReplace() {
        var directive = {
            link: link,
            require: 'ngInclude',
            restrict: 'A'
        };

        return directive;

        function link(scope, element, attrs) {
            element.replaceWith(element.children());
        }
    }
})();
