(function() {
    'use strict';

    angular
        .module('app')
        .directive('section', section);

    function section() {
        var directive = {
            restrict: 'A',
            templateUrl: 'app/directives/section/view.html',
            scope: {
                section: "="
            }
        };

        return directive;
    }
})();
