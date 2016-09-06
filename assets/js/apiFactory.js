(function(){
    'use strict';

    angular
        .module('api')
        .factory('api', api)

    api.$inject = ['$http', '$q'];

    function api($http, $q) {
        var factory = {
            get: get
        };

        return factory;

        function get(url) {
            var d = $q.defer();

            $http.get(url)
            .then(function(response){
                d.resolve(response.data);
            }, function(response){
                d.reject(response);
            });

            return d.promise;
        }
    }
})();