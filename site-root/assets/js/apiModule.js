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
            .state('apiDeeplink3', {
                url: '/:spec/:h1/:h2/:h3',
                templateUrl: 'app/apiView.html',
                controller: 'apiController',
                controllerAs: 'vm'
            })
            .state('apiDeeplink2', {
                url: '/:spec/:h1/:h2',
                templateUrl: 'app/apiView.html',
                controller: 'apiController',
                controllerAs: 'vm'
            })
            .state('apiDeeplink1', {
                url: '/:spec/:h1',
                templateUrl: 'app/apiView.html',
                controller: 'apiController',
                controllerAs: 'vm'
            })
            .state('apiDeeplink0', {
                url: '/:spec',
                templateUrl: 'app/apiView.html',
                controller: 'apiController',
                controllerAs: 'vm'
            })
            .state('api', {
                url: '/',
                templateUrl: 'app/apiView.html',
                controller: 'apiController',
                controllerAs: 'vm'
            });
    }
})();