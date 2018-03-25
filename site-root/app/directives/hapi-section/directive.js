(function() {
    'use strict';

    angular
        .module('app')
        .directive('hapiSection', hapiSection);

    function hapiSection() {
        var directive = {
            restrict: 'A',
            templateUrl: 'app/directives/hapi-section/view.html',
            scope: {
                section: "<hapiScopeSection"
            }
        };

        return directive;
    }
})();
