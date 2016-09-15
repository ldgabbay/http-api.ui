(function(){
    'use strict';

    angular
        .module('api', [])
        .config(config);

    config.$inject = ['$compileProvider'];

    function config($compileProvider) {
        $compileProvider.debugInfoEnabled(false);
    }
})();