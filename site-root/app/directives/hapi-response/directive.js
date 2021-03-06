(function() {
    'use strict';

    angular
        .module('app')
        .directive('hapiResponse', hapiResponse);

    function hapiResponse() {
        var directive = {
            link: link,
            restrict: 'A',
            templateUrl: 'app/directives/hapi-response/view.html',
            scope: {
                response: "<hapiScopeResponse"
            }
        };

        return directive;

        function link(scope, iElement, iAttrs, controller, transcludeFn) {
            scope.selected = 0;
            scope.select = function(index) { scope.selected = index; };
        }
    }
})();
