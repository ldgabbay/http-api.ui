(function() {
    'use strict';

    angular
        .module('app')
        .directive('hapiResponse', hapiResponse);

    function hapiResponse() {
        var directive = {
            restrict: 'A',
            templateUrl: 'app/directives/hapi-response/view.html',
            scope: {
                response: "<hapiScopeResponse"
            }
        };

        return directive;
    }
})();
