(function() {
    'use strict';

    angular
        .module('api')
        .directive('stringSchema', stringSchema);

    function stringSchema() {
        var directive = {
            restrict: 'A',
            templateUrl: 'app/shared/string-schema/view.html',
            scope: {
                model: "="
            }
        };

        return directive;
    }
})();

// <span string-schema model="foo"></span>
