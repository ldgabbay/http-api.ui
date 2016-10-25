(function() {
    'use strict';

    angular
        .module('api')
        .filter('addTargetBlank', addTargetBlank);

    function addTargetBlank() {
        return function(input) {
            var html = angular.element('<div>' + input + '</div>'); // Defensively wrap in a div to avoid 'invalid html' exception
            html.find('a').attr('target', '_blank');
            
            return angular.element('<div></div>').append(html).html(); // Trick to have a string representation of HTML
        };
    };
})();