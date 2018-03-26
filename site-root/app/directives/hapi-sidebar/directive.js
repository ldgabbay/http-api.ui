(function() {
    'use strict';

    angular
        .module('app')
        .directive('hapiSidebar', hapiSidebar);

    function hapiSidebar() {
        var directive = {
            restrict: 'A',
            templateUrl: 'app/directives/hapi-sidebar/view.html',
            scope: {
                vm: "<hapiScopeVm"
            }
        };

        return directive;
    }
})();
