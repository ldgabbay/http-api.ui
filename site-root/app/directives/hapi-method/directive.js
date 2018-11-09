(function() {
    'use strict';

    angular
        .module('app')
        .directive('hapiMethod', hapiMethod);

    function hapiMethod() {
        var directive = {
            link: link,
            restrict: 'A',
            templateUrl: 'app/directives/hapi-method/view.html',
            scope: {
                section: "<hapiScopeSection",
                method: "<hapiScopeMethod",
                collapsible: "<hapiScopeCollapsible"
            }
        };

        return directive;

        function link(scope, iElement, iAttrs, controller, transcludeFn) {
            scope.requestParameterListTypes = ['path', 'query', 'header'];

            scope.selectA = function(index) { scope.selectedA = index; };
            scope.selectB = function(index) { scope.selectedB = index; };

            scope.$watch('method', function(oldVal, newVal) {
                scope.selectedA = 0;
                scope.selectedB = 0;
            });
        }
    }
})();
