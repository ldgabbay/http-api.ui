(function() {
    'use strict';

    angular
        .module('api')
        .controller('apiController', apiController);

    apiController.$inject = ['$anchorScroll', '$scope', '$state', '$stateParams', '$interval', '$timeout', '$filter', 'api', 'Parser'];

    function apiController($anchorScroll, $scope, $state, $stateParams, $interval, $timeout, $filter, api, Parser) {
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

        vm.hideSchemas = false;
        vm.loading = false;
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
            getApiList();
        }

        function getApiList() {
            vm.loading = true;

            vm.specUrl = $stateParams.src;

            if (!vm.specUrl) {
                alert('Please specify API spec URL.');
            } else {
                getApiSpecificicationJson(vm.specUrl);                
            }
        }

        function getApiSpecificicationJson(url) {
            vm.loading = true;
            vm.ooSpec = null;

            $timeout(function() {
                api
                .get(url)
                .then(function(response) {
                    try {
                        vm.ooSpec = Parser.parse(response);
                    }
                    catch(e) {
                        if (e instanceof Parser.ParseError) {
                            alert('An error occurred while parsing API specifications from ' + url + '\n' + e.message);
                        }
                    }

                    var h1 = $stateParams.h1,
                        h2 = $stateParams.h2,
                        h3 = $stateParams.h3;

                    $timeout(function() {
                        scrollTo(h1, h2, h3);
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
                if (!vm.loading) {
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
