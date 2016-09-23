(function() {
    'use strict';

    angular
        .module('api')
        .filter('unsafeHTML', unsafeHtml);

    unsafeHtml.$inject = ['$sce'];

    function unsafeHtml($sce) {
        return function(input) {
            return $sce.trustAsHtml(input);
        };
    };
})();