(function() {
    'use strict';

    angular
        .module('app')
        .directive('navigationResize', navigationResize);

    navigationResize.$inject = ['$document', '$window'];

    function navigationResize($document, $window) {
        var active = false;
        var defaultWidth = 300;
        var currentWidth = null;
        var resizeContainerOffset = 3;
        var content = angular.element('.content');
        var navigation = angular.element('.navigation-outer, .navigation-mid');
        var directive = {
            link: link,
            restrict: 'AE'
        };

        return directive;

        function pauseEvent(e){
            if(e.stopPropagation) e.stopPropagation();
            if(e.preventDefault) e.preventDefault();
            e.cancelBubble=true;
            e.returnValue=false;
            return false;
        }

        function link(scope, element, attrs) {
            resizeNavigation(defaultWidth);

            var lastWindowWidth = $window.outerWidth;

            element.bind('mousedown', function(e) {
                active = true;
                return pauseEvent(e);
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
                var windowWidth = $window.outerWidth;
                resizeNavigation(currentWidth * windowWidth / lastWindowWidth);
                lastWindowWidth = windowWidth;
            });

            function resizeNavigation(width) {
                if (width < resizeContainerOffset)
                    width = resizeContainerOffset;
                if (width > $window.outerWidth - resizeContainerOffset)
                    width = $window.outerWidth - resizeContainerOffset;

                currentWidth = width;
                width += 'px';

                element.css('left', width);
                navigation.css('width', width);
                content.css('margin-left', width);
            }
        }
    }
})();
