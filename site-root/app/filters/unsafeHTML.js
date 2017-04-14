(function() {
    'use strict';

    angular
        .module('app')
        .filter('unsafeHTML', unsafeHtml);

    unsafeHtml.$inject = ['$sce'];

    function unsafeHtml($sce) {
        return function(input) {
            return $sce.trustAsHtml(input);
        };
    }
})();
