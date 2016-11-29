(function() {
    'use strict';

    angular
        .module('api')
        .controller('apiController', apiController);

    apiController.$inject = ['$anchorScroll', '$scope', '$state', '$stateParams', '$interval', '$timeout', '$filter', 'api', 'Parser'];

    function apiController($anchorScroll, $scope, $state, $stateParams, $interval, $timeout, $filter, api, Parser) {
        var vm = this;
        var options = {
            specListUrl: 'specs.json',
            apiContainerSelector: '.api-container',
            jsonTabSize: 2,
            stateChangeOptions: {
                notify: false,
                reload: false
            },
            stateChangeOptionsWithOverride: {
                location: 'replace',
                notify: false,
                reload: false
            }
        };

        vm.hideSchemas = false;
        vm.loading = false;
//        vm.scrollToMethod = scrollToMethod;
//        vm.scrollToSchema = scrollToSchema;
        vm.ooSpec = null;
        vm.specList = null;
        vm.specUrl = null;
        vm.specName = null;
        vm.toggleFirstResponse = toggleFirstResponse;
        vm.toggleResponse = toggleResponse;
        vm.schemaTypes = ['string', 'json'];
        vm.requestParameterListTypes = ['path', 'query', 'header'];
        vm.scrollTo = scrollTo;

        activate();

        function activate() {
            $anchorScroll.yOffset = parseInt(angular.element(options.apiContainerSelector).css('padding-top'));
            getApiList();
        }

        function getApiList() {
            vm.loading = true;

            api
            .get(options.specListUrl)
            .then(function(response) {
                vm.specList = response;

                if (vm.specList.length) {
                    if ($stateParams.spec) {
                        var spec = $stateParams.spec;

                        for (var i=0, len=vm.specList.length; i!==len; ++i) {
                            if (vm.specList[i].name === spec) {
                                vm.specUrl = vm.specList[i].path;
                                vm.specName = vm.specList[i].name;
                                break;
                            }
                        }
                    } else {
                        // do this when the path is just '/'
                        vm.specUrl = vm.specList[0].path;
                        vm.specName = vm.specList[0].name;
                    }

                    if (!vm.specUrl) {
                        $state.go('api');
                    }

                    $scope.$watch('vm.specUrl', function(newVal, oldVal) {
                        getApiSpecificicationJson(newVal);

                        for (var i = 0, len = vm.specList.length; i < len; i++) {
                            if (vm.specList[i].path === newVal) {
                                vm.specName = vm.specList[i].name;

                                // $state.go('apiDeeplink0', {
                                //     spec: vm.specName
                                // }, options.stateChangeOptionsWithOverride);

                                break;
                            }
                        }
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
            vm.loading = true;
            vm.ooSpec = null;

            $timeout(function() {
                api
                .get(url)
                .then(function(response) {
                    try {
                        Parser.validate(response);
                    }
                    catch(e) {
                        if (e instanceof Parser.ParseError) {
                            alert('An error occurred while parsing API specifications from ' + url + '\n' + e.message);
                        }
                    }

                    vm.ooSpec = Parser.parse(response);

                    $timeout(function() {
                        scrollTo($stateParams.h1, $stateParams.h2, $stateParams.h3);
                    }, 1250);

                }, function(response) {
                    alert('An error occurred while retrieving API specifications from ' + url);
                })['finally'](function() {
                    // TODO find a better way to know when angular is finally done
                    $timeout(function() {
                        vm.loading = false;
                    });
                });
            });
        }

        function scrollTo(h1, h2, h3) {
            if (h3) {
                $state.go('apiDeeplink3', {
                    spec: vm.specName,
                    h1: h1,
                    h2: h2,
                    h3: h3
                }, options.stateChangeOptionsWithOverride);

                scrollToID($filter('escapeID')([h1, h2, h3]));
            } else if (h2) {
                $state.go('apiDeeplink2', {
                    spec: vm.specName,
                    h1: h1,
                    h2: h2
                }, options.stateChangeOptionsWithOverride);

                scrollToID($filter('escapeID')([h1, h2]));
            } else if (h1) {
                $state.go('apiDeeplink1', {
                    spec: vm.specName,
                    h1: h1
                }, options.stateChangeOptionsWithOverride);

                scrollToID($filter('escapeID')(h1));
            } else {
                $state.go('apiDeeplink0', {
                    spec: vm.specName
                }, options.stateChangeOptionsWithOverride);

                scrollToID($filter('escapeID')('api'));
            }
        }

        function scrollToID(tag, period) {
            function wait() {
                if (!vm.loading) {
                    $anchorScroll(tag);
                } else {
                    $timeout(wait, period);
                }
            }

            $timeout(wait);
        }

//        function scrollToMethod(section, method, overrideState) {
//            var id = section.name;
//            section.__hide = false;
//
//            if (method) {
//                id += '-' + method.method + '-' + method.location;
//                method.__hide = false;
//            }
//
//            $state.go('apiDeeplink', {
//                spec: $filter('escapeID')(vm.specName),
//                section: $filter('escapeID')(id)
//            }, overrideState ? options.stateChangeOptionsWithOverride : options.stateChangeOptions);
//
//            $timeout(function() {
//                $anchorScroll($filter('escapeID')(id));
//            });
//        }
//
//        function scrollToSchema(name, overrideState) {
//            if (!name) {
//                return;
//            }
//
//            var slug = 'schemas',
//                schema = vm.spec.schemas.find(name);
//            vm.hideSchemas = false;
//
//
//            if (typeof(schema) !== 'undefined') {
//                schema.__show = true;
//                slug = 'schema-' + $filter('escapeID')(schema.name);
//
//                $state.go('apiDeeplink', {
//                    spec: $filter('escapeID')(vm.specName),
//                    section: slug
//                }, overrideState ? options.stateChangeOptionsWithOverride : options.stateChangeOptions);
//
//                $timeout(function() {
//                    $anchorScroll(slug);
//                });
//            }
//        }

        function toggleFirstResponse(index, responses, response) {
            if (index === 0) {
                vm.toggleResponse(responses, response);
            }
        }

        function toggleResponse(responses, response) {
            responses.map(function(response) {
                response.__hide = true;
            });

            response.__hide = false;
        }
    }
})();
