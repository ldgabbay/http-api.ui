(function() {
    'use strict';

    angular
        .module('app')
        .directive('navigationResize', navigationResize);

    navigationResize.$inject = ['$document', '$window'];

    function navigationResize($document, $window) {
        var directive = {
            link: link,
            restrict: 'AE'
        };

        var gripWidth = 6;
        var minMargin = gripWidth;

        return directive;

        function link(scope, element, attrs) {
            var content = angular.element('.content');
            var navigationOuter = angular.element('.navigation-outer');
            var navigationMid = angular.element('.navigation-mid');

            var startX, startWidth;

            element.bind('mousedown', initDrag);

            angular.element($window).bind('resize', resize);

            function resize(e) {
                var width = parseInt($window.getComputedStyle(navigationOuter[0], null).width);
                setWidth(width);
            }

            function initDrag(e) {
                scope.vm.noselect = true;
                startX = e.clientX;
                startWidth = parseInt($window.getComputedStyle(navigationOuter[0], null).width);
                $document.bind('mousemove', doDrag);
                $document.bind('mouseup', stopDrag);
            }

            function doDrag(e) {
                var newWidth = (startWidth + e.clientX - startX);
                setWidth(newWidth);
            }

            function stopDrag(e) {
                $document.unbind('mousemove', doDrag);
                $document.unbind('mouseup', stopDrag);
                scope.vm.noselect = false;
            }

            function setWidth(newWidth) {
                if (newWidth < minMargin)
                    newWidth = minMargin;
                if (newWidth > $window.outerWidth - minMargin + gripWidth)
                    newWidth = $window.outerWidth - minMargin + gripWidth;

                element.css('left', (newWidth-gripWidth) + 'px');
                navigationOuter.css('width', (newWidth) + 'px');
                navigationMid.css('width', (newWidth-gripWidth) + 'px');
                content.css('margin-left', (newWidth) + 'px');
            }
        }
    }
})();
