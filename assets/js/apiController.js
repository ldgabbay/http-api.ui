(function(){
    'use strict';

    angular
        .module('api')
        .controller('apiController', apiController);

    apiController.$inject = ['$anchorScroll', '$scope', '$timeout', 'api'];
    
    function apiController($anchorScroll, $scope, $timeout, api) {
        var vm = this;
        vm.isBodyList = isBodyList;
        vm.isEmptyObject = isEmptyObject;
        vm.isParameterList = isParameterList;
        vm.loading = false;
        vm.prettifyJsonObject = prettifyJsonObject;
        vm.scrollTo = scrollTo;
        vm.slugify = slugify;
        vm.spec = null;
        vm.specList = null;
        vm.specUrl = null;
        vm.toggleFirstParameterType = toggleFirstParameterType;
        vm.toggleFirstResponse = toggleFirstResponse;
        vm.toggleParameterType = toggleParameterType;
        vm.toggleResponse = toggleResponse;

        activate();

        function activate() {
            $anchorScroll.yOffset = 20;
            getApiList();
        }

        function getApiList() {
            if (vm.loding) return;

            vm.loading = true;

            api.get('specs.json')
            .then(function(response) {
                vm.specList = response;

                if (vm.specList.length) {
                    vm.specUrl = vm.specList[0].path;

                    $scope.$watch('vm.specUrl', function(newVal, oldVal) {
                        getApiSpecificicationJson(newVal);
                    });
                } else {
                    alert('No API specifications found.');
                    vm.loading = false;
                }
            }, function(response) {
                alert('An error occurred while retrieving the list of API specifications');
                vm.loading = false;
            });
        }

        function getApiSpecificicationJson(url) {
            if (vm.loding) return;

            vm.loading = true;
            vm.spec = null;

            $timeout(function(){
                api.get(url)
                .then(function(response) {
                    vm.spec = response;
                }, function(response) {
                    alert('An error occurred while retrieving API specifications from ' + url);
                })['finally'](function() {
                    vm.loading = false;
                });
            }, 500);
        }

        function isBodyList(requestType) {
            return requestType.toLowerCase() === 'body';
        }
        
        function isEmptyObject(obj) {
            return angular.equals({}, obj);
        }
        
        function isParameterList(requestType) {
            return ['path', 'query', 'header'].indexOf(requestType.toLowerCase()) !== -1;
        }

        function prettifyJsonObject(obj) {
            return JSON.stringify(obj, null, 2);
        }

        function scrollTo(location, method) {
            var id = location.location;
            location.__hide = false;
            
            if (method) {
                method.__hide = false;
                id = id + '-' + method.method;
            }
            
            $timeout(function(){
                $anchorScroll(vm.slugify(id));
            });
        }

        function slugify(str) {
            return str.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
        }

        function toggleFirstParameterType(index, requestObj, requestType) {
            if (index === 0) {
                vm.toggleParameterType(requestObj, requestType);
            }
        }

        function toggleFirstResponse(index, responses, response) {
            if (index === 0) {
                vm.toggleResponse(responses, response);
            }
        }

        function toggleParameterType(requestObj, requestType) {
            for (var key in requestObj) {
                if (requestObj.hasOwnProperty(key)) {
                    requestObj[key].__hide = true;
                }
            }

            requestObj[requestType].__hide = false;
        }

        function toggleResponse(responses, response) {
            responses.map(function(response) {
                response.__hide = true;
            });

            response.__hide = false;
        }
    }
})();