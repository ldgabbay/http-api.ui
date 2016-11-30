(function() {
    'use strict';

    angular
        .module('api')
        .filter('addTargetBlank', addTargetBlank);

    function addTargetBlank() {
        return function(input) {
            var html = angular.element('<div>' + input + '</div>'); // wrap input to create a single element
            html.find('a').attr('target', '_blank');
            return html.html(); // return inner HTML from the artificially added div
        };
    };
})();