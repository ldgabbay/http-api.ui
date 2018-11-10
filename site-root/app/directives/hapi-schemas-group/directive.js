(function() {
    'use strict';

    angular
        .module('app')
        .directive('hapiSchemasGroup', hapiSchemasGroup);

    function hapiSchemasGroup() {
        var directive = {
            restrict: 'A',
            templateUrl: 'app/directives/hapi-schemas-group/view.html',
            scope: {
                vm: "<hapiScopeVm",
                type: "<hapiScopeType"
            }
        };

        return directive;
    }
})();
