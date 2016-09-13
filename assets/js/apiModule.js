(function(){
    'use strict';

    angular
        .module('api', ['hljs'])
        .config(config);

    config.$inject = ['$compileProvider'];

    function config($compileProvider) {
        $compileProvider.debugInfoEnabled(false);
    }
})();