(function() {
    'use strict';

    angular
        .module('app')
        .controller('appController', appController);

    appController.$inject = ['$anchorScroll', '$scope', '$state', '$stateParams', '$interval', '$timeout', '$filter', 'api', 'Parser'];

    function appController($anchorScroll, $scope, $state, $stateParams, $interval, $timeout, $filter, api, Parser) {
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
        vm.appState = 'loaded';
        vm.ooSpec = null;
        vm.specUrl = null;
        vm.toggleFirstResponse = toggleFirstResponse;
        vm.toggleResponse = toggleResponse;
        vm.schemaTypes = ['string', 'json'];
        vm.requestParameterListTypes = ['path', 'query', 'header'];
        vm.scrollTo = scrollTo;

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
                alert('Please specify API spec URL.');
                $state.go('error');
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
                            alert('An error occurred while parsing API specifications from ' + url + '\n' + e.message);
                            $state.go('error');
                            vm.appState = 'error';
                        }
                    }

                    var h1 = $stateParams.h1,
                        h2 = $stateParams.h2,
                        h3 = $stateParams.h3;

                    scrollTo(h1, h2, h3);

                }, function(response) {
                    alert('An error occurred while retrieving API specifications from ' + url);
                    $state.go('error');
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

                scrollToID($filter('escapeID')([h1, h2, h3]));
            } else if (h2) {
                $state.go('apiDeeplink2', {
                    src: vm.specUrl,
                    h1: h1,
                    h2: h2
                }, options.stateChangeOptionsWithOverride);

                scrollToID($filter('escapeID')([h1, h2]));
            } else if (h1) {
                $state.go('apiDeeplink1', {
                    src: vm.specUrl,
                    h1: h1
                }, options.stateChangeOptionsWithOverride);

                scrollToID($filter('escapeID')(h1));
            } else {
                $state.go('apiDeeplink0', {
                    src: vm.specUrl
                }, options.stateChangeOptionsWithOverride);

                scrollToID($filter('escapeID')('api'));
            }
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
