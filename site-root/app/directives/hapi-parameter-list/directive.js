(function() {
    'use strict';

    angular
        .module('app')
        .directive('hapiParameterList', hapiParameterList);

    function hapiParameterList() {
        var directive = {
            link: link,
            restrict: 'A',
            templateUrl: 'app/directives/hapi-parameter-list/view.html',
            scope: {
                model: "=hapiScopeModel"
            }
        };

        return directive;

        function link(scope, element, attributes) {
            scope.showName = false;
            scope.showValue = false;
        }
    }
})();
