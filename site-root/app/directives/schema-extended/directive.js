(function() {
    'use strict';

    angular
        .module('app')
        .directive('schemaExtended', schemaExtended);

    function schemaExtended() {
        var directive = {
            restrict: 'C',
            templateUrl: 'app/directives/schema-extended/view.html',
            scope: {
                model: "=",
                show: "="
            }
        };

        return directive;
    }
})();
