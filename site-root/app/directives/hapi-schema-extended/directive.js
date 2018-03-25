(function() {
    'use strict';

    angular
        .module('app')
        .directive('hapiSchemaExtended', hapiSchemaExtended);

    function hapiSchemaExtended() {
        var directive = {
            restrict: 'A',
            templateUrl: 'app/directives/hapi-schema-extended/view.html',
            scope: {
                model: "=hapiScopeModel",
                show: "=hapiScopeShow"
            }
        };

        return directive;
    }
})();
