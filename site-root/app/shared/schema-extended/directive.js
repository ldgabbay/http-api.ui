(function() {
    'use strict';

    angular
        .module('api')
        .directive('schemaExtended', schemaExtended);

    function schemaExtended() {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/shared/schema-extended/view.html',
            scope: {
                model: "=",
                showScope: "="
            }
        };

        return directive;
    }
})();
