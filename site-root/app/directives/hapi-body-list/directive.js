(function() {
    'use strict';

    angular
        .module('app')
        .directive('hapiBodyList', hapiBodyList);

    function hapiBodyList() {
        var directive = {
            link: link,
            restrict: 'A',
            templateUrl: 'app/directives/hapi-body-list/view.html',
            scope: {
                bodyList: "<hapiScopeBodyList"
            }
        };

        return directive;

        function link(scope, iElement, iAttrs, controller, transcludeFn) {
            scope.selected = 0;
            scope.select = function(index) { scope.selected = index; };
        }
    }
})();
