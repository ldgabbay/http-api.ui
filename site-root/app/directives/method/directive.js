(function() {
    'use strict';

    angular
        .module('app')
        .directive('method', method);

    function method() {
        var directive = {
            restrict: 'A',
            templateUrl: 'app/directives/method/view.html',
            scope: {
                section: "=sectionv",
                method: "="
            }
        };

        return directive;
    }
})();
