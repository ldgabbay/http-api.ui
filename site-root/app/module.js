(function(){
    'use strict';

    angular
        .module('app', ['ui.router'])
        .config(config);

    config.$inject = ['$compileProvider', '$stateProvider', '$urlRouterProvider', '$locationProvider'];

    function config($compileProvider, $stateProvider, $urlRouterProvider, $locationProvider) {
        $compileProvider.debugInfoEnabled(false);
        $urlRouterProvider.otherwise('/');
        $locationProvider.hashPrefix('');

        $stateProvider
            .state('apiDeeplink3', {
                url: '/:h1/:h2/:h3?src',
                templateUrl: 'app/controllers/app/view.html',
                controller: 'appController',
                controllerAs: 'vm'
            })
            .state('apiDeeplink2', {
                url: '/:h1/:h2?src',
                templateUrl: 'app/controllers/app/view.html',
                controller: 'appController',
                controllerAs: 'vm'
            })
            .state('apiDeeplink1', {
                url: '/:h1?src',
                templateUrl: 'app/controllers/app/view.html',
                controller: 'appController',
                controllerAs: 'vm'
            })
            .state('apiDeeplink0', {
                url: '/?src',
                templateUrl: 'app/controllers/app/view.html',
                controller: 'appController',
                controllerAs: 'vm'
            });
    }
})();
