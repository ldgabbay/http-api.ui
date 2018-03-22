(function() {
    'use strict';

    angular
        .module('app')
        .directive('method', method);

    function method() {
        var directive = {
            link: link,
            restrict: 'A',
            templateUrl: 'app/directives/method/view.html',
            scope: {
                section: "<vSection",
                method: "<"
            }
        };

        return directive;

        function link(scope, iElement, iAttrs, controller, transcludeFn) {
            scope.requestParameterListTypes = ['path', 'query', 'header'];
        }
    }
})();
