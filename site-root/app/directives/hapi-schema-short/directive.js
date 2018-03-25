(function() {
    'use strict';

    angular
        .module('app')
        .directive('hapiSchemaShort', hapiSchemaShort);

    function hapiSchemaShort() {
        var directive = {
            restrict: 'A',
            templateUrl: 'app/directives/hapi-schema-short/view.html',
            scope: {
                model: "=hapiScopeModel",
                show: "=hapiScopeShow"
            }
        };

        return directive;
    }
})();
