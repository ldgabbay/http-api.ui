(function() {
    'use strict';

    angular
        .module('app')
        .directive('schemaShort', schemaShort);

    function schemaShort() {
        var directive = {
            restrict: 'C',
            templateUrl: 'app/directives/schema-short/view.html',
            scope: {
                model: "=",
                show: "="
            }
        };

        return directive;
    }
})();
