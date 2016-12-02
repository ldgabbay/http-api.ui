(function() {
    'use strict';

    angular
        .module('api')
        .directive('schemaShort', schemaShort);

    function schemaShort() {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/shared/schema-short/view.html',
            scope: {
                model: "=",
                show: "="
            }
        };

        return directive;
    }
})();
