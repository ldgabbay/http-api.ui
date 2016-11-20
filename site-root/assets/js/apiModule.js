(function(){
    'use strict';

    angular
        .module('api', ['ui.router'])
        .config(config);

    config.$inject = ['$compileProvider', '$stateProvider', '$urlRouterProvider'];

    function config($compileProvider, $stateProvider, $urlRouterProvider) {
        $compileProvider.debugInfoEnabled(false);
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('apiDeeplink', {
                url: '/:spec/:section',
                templateUrl: '/app/apiView.html',
                controller: 'apiController',
                controllerAs: 'vm'
            })
            .state('api', {
                url: '/',
                templateUrl: '/app/apiView.html',
                controller: 'apiController',
                controllerAs: 'vm'
            });
    }
})();