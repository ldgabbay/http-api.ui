(function() {
    'use strict';

    angular
        .module('api')
        .directive('schemaShort', schemaShort);

    function schemaShort() {
        var directive = {
            restrict: 'C',
            templateUrl: 'app/shared/schema-short/view.html',
            scope: {
                model: "=",
                show: "="
            }
        };

        return directive;
    }
})();
