(function() {
    'use strict';

    angular
        .module('app')
        .directive('parameterList', parameterList);

    function parameterList() {
        var directive = {
            link: link,
            restrict: 'C',
            templateUrl: 'app/directives/parameter-list/view.html',
            scope: {
                model: "="
            }
        };

        return directive;

        function link(scope, element, attributes) {
            scope.showName = false;
            scope.showValue = false;
        }
    }
})();
