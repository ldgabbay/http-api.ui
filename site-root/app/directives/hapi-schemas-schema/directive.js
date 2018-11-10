(function() {
    'use strict';

    angular
        .module('app')
        .directive('hapiSchemasSchema', hapiSchemasSchema);

    function hapiSchemasSchema() {
        var directive = {
            restrict: 'A',
            templateUrl: 'app/directives/hapi-schemas-schema/view.html',
            scope: {
                tag: "<hapiScopeTag",
                schema: "<hapiScopeSchema",
                collapsible: "<hapiScopeCollapsible"
            }
        };

        return directive;
    }
})();
