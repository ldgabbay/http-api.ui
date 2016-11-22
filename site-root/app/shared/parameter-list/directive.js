(function() {
    'use strict';

    angular
        .module('api')
        .directive('parameterList', parameterList);

    function parameterList() {
        var directive = {
            link: link,
            restrict: 'E',
            templateUrl: 'app/shared/parameter-list/view.html',
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
