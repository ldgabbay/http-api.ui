(function() {
    'use strict';

    angular
        .module('api')
        .directive('navigationResize', navigationResize);

    navigationResize.$inject = ['$document', '$window'];

    function navigationResize($document, $window) {
        var active = false;
        var defaultWidth = 200;
        var currentWidth = null;
        var resizeContainerOffset = 3;
        var content = angular.element('.content');
        var navigation = angular.element('.navigation-outer, .navigation-mid');
        var directive = {
            link: link,
            restrict: 'AE'
        };

        return directive;

        function link(scope, element, attrs) {
            resizeNavigation(defaultWidth);

            element.bind('mousedown', function(e) {
                active = true;
            });

            $document.bind('mousemove', function(e) {
                if (active) {
                    resizeNavigation(e.pageX);
                }
            });

            $document.bind('mouseup', function(e) {
                active = false;
            });

            angular.element($window).bind('resize', function(e) {
                var windowWidth = $window.outerWidth - resizeContainerOffset;
                
                if (currentWidth > windowWidth) {
                    resizeNavigation(windowWidth);
                }
            });

            function resizeNavigation(width) {
                if (width >= resizeContainerOffset && width <= ($window.outerWidth - resizeContainerOffset)) {
                    currentWidth = width;
                    width += 'px';

                    element.css('left', width);
                    navigation.css('width', width);
                    content.css('margin-left', width);

                }
            }
        }
    }
})();