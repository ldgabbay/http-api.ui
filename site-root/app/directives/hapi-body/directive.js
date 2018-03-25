(function() {
    'use strict';

    angular
        .module('app')
        .directive('hapiBody', hapiBody);

    function hapiBody() {
        var directive = {
            restrict: 'A',
            templateUrl: 'app/directives/hapi-body/view.html',
            scope: {
                body: "=hapiScopeBody"
            }
        };

        return directive;
    }
})();
