(function() {
    'use strict';

    angular
        .module('app')
        .controller('appController', appController);

    appController.$inject = ['$window', '$anchorScroll', '$scope', '$state', '$stateParams', '$interval', '$timeout', '$filter', 'api', 'Parser'];

    function appController($window, $anchorScroll, $scope, $state, $stateParams, $interval, $timeout, $filter, api, Parser) {
        var vm = this;
        var options = {
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

        vm.noselect = false;
        vm.hideSchemas = false;
        vm.appState = 'none';
        vm.contentState = 'original';
        vm.ooSpec = null;
        vm.specUrl = null;
        vm.schemaTypes = ['string', 'json'];
        vm.scrollTo = scrollTo;
        vm.errorMessage = '';
        vm.errorDetails = '';

        activate();

        function activate() {
            $anchorScroll.yOffset = parseInt(angular.element(options.apiContainerSelector).css('padding-top'));
            // TODO is NaN now
            $anchorScroll.yOffset = 8;
            getApiList();
        }

        function getApiList() {
            vm.appState = 'loading';

            vm.specUrl = $stateParams.src;

            if (!vm.specUrl) {
                vm.errorMessage = 'Please specify API spec URL.';
                vm.errorDetails = '';
                vm.appState = 'error';
            } else {
                getApiSpecificicationJson(vm.specUrl);                
            }
        }

        function getApiSpecificicationJson(url) {
            vm.appState = 'loading';
            vm.ooSpec = null;

            $timeout(function() {
                api
                .get(url)
                .then(function(response) {
                    try {
                        vm.ooSpec = Parser.parse(response);
                        // TODO the ui may not be ready yet... need to figure out when angular is done
                        vm.appState = 'loaded';
                    }
                    catch(e) {
                        if (e instanceof Parser.ParseError) {
                            vm.errorMessage = 'An error occurred while parsing API specifications from ' + url;
                            vm.errorDetails = e.message;
                            vm.appState = 'error';
                        }
                    }

                    var h1 = $stateParams.h1,
                        h2 = $stateParams.h2,
                        h3 = $stateParams.h3;

                    scrollTo(h1, h2, h3);

                }, function(response) {
                    vm.errorMessage = 'An error occurred while retrieving API specifications from ' + url;
                    vm.errorDetails = '';
                    vm.appState = 'error';
                })
                // ['finally'](function() {
                // })
                ;
            });
        }

        function scrollTo(h1, h2, h3) {
            if (h3) {
                $state.go('apiDeeplink3', {
                    src: vm.specUrl,
                    h1: h1,
                    h2: h2,
                    h3: h3
                }, options.stateChangeOptionsWithOverride);

                if (h1 === "api") {
                    vm.content = {
                        section: vm.ooSpec.sections[h2],
                        method: vm.ooSpec.methods[h3]
                    };
                    vm.contentState = 'api-method';
                } else if (h1 === "schema") {
                    vm.content = {
                        schemaTag: h3,
                        schema: vm.ooSpec.schemas[h2][h3]
                    };
                    vm.contentState = 'schemas-schema';
                }
            } else if (h2) {
                $state.go('apiDeeplink2', {
                    src: vm.specUrl,
                    h1: h1,
                    h2: h2
                }, options.stateChangeOptionsWithOverride);

                if (h1 === "api") {
                    vm.content = {
                        section: vm.ooSpec.sections[h2]
                    };
                    vm.contentState = 'api-section';
                } else if (h1 === "schema") {
                    vm.content = {
                        schemaGroup: h2
                    };
                    vm.contentState = 'schemas-group';
                }
            } else if (h1) {
                $state.go('apiDeeplink1', {
                    src: vm.specUrl,
                    h1: h1
                }, options.stateChangeOptionsWithOverride);

                if (h1 === "api") {
                    vm.content = null;
                    vm.contentState = 'api';
                } else if (h1 === "schema") {
                    vm.content = null;
                    vm.contentState = 'schemas';
                }
            } else {
                $state.go('apiDeeplink0', {
                    src: vm.specUrl
                }, options.stateChangeOptionsWithOverride);

                vm.content = null;
                vm.contentState = 'api';
            }
            $window.scrollTo(0, 0);
        }

        function scrollToID(tag, period) {
            function wait() {
                if (vm.appState === 'loaded') {
                    $anchorScroll(tag);
                } else {
                    $timeout(wait, period);
                }
            }

            $timeout(wait);
        }
    }
})();
