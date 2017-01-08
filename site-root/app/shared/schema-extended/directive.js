(function() {
    'use strict';

    angular
        .module('api')
        .directive('schemaExtended', schemaExtended);

    function schemaExtended() {
        var directive = {
            restrict: 'C',
            templateUrl: 'app/shared/schema-extended/view.html',
            scope: {
                model: "=",
                show: "="
            }
        };

        return directive;
    }
})();
