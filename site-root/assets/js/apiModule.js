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
            .state('error', {
                url: '/error',
                templateUrl: 'app/error.html',
                controller: 'errorController',
                controllerAs: 'vm'
            })
            .state('apiDeeplink3', {
                url: '/:h1/:h2/:h3?src',
                templateUrl: 'app/apiView.html',
                controller: 'apiController',
                controllerAs: 'vm'
            })
            .state('apiDeeplink2', {
                url: '/:h1/:h2?src',
                templateUrl: 'app/apiView.html',
                controller: 'apiController',
                controllerAs: 'vm'
            })
            .state('apiDeeplink1', {
                url: '/:h1?src',
                templateUrl: 'app/apiView.html',
                controller: 'apiController',
                controllerAs: 'vm'
            })
            .state('apiDeeplink0', {
                url: '/?src',
                templateUrl: 'app/apiView.html',
                controller: 'apiController',
                controllerAs: 'vm'
            });
    }
})();