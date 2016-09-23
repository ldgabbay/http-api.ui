(function() {
    'use strict';

    angular
        .module('api')
        .filter('lineBreak', lineBreak);

    function lineBreak() {
        return function(input) {
            return input.replace(/\n/g, '<br />');
        };
    };
})();