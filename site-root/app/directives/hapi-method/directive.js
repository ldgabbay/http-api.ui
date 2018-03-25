(function() {
    'use strict';

    angular
        .module('app')
        .directive('hapiMethod', hapiMethod);

    function hapiMethod() {
        var directive = {
            link: link,
            restrict: 'A',
            templateUrl: 'app/directives/hapi-method/view.html',
            scope: {
                section: "<hapiScopeSection",
                method: "<hapiScopeMethod"
            }
        };

        return directive;

        function link(scope, iElement, iAttrs, controller, transcludeFn) {
            scope.requestParameterListTypes = ['path', 'query', 'header'];
            scope.requestHasPath = scope.method.request.path && scope.method.request.path.length;
            scope.requestHasQuery = scope.method.request.query && scope.method.request.query.length;
            scope.requestHasHeader = scope.method.request.header && scope.method.request.header.length;
            scope.requestHasBody = scope.method.request.body && scope.method.request.body.length;
            scope.isEmpty = !(scope.requestHasPath || scope.requestHasQuery || scope.requestHasHeader || scope.requestHasBody);

            scope.toggleFirstResponse = toggleFirstResponse;
            scope.toggleResponse = toggleResponse;
        }

        function toggleFirstResponse(index, responses, response) {
            if (index === 0) {
                toggleResponse(responses, response);
            }
        }

        function toggleResponse(responses, response) {
            responses.map(function(response) {
                response.__hide = true;
            });

            response.__hide = false;
        }
    }
})();
