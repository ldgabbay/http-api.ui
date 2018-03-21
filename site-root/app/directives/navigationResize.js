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

        return directive;

        function link(scope, element, attrs) {
            var content = angular.element('.content');
            var navigationOuter = angular.element('.navigation-outer');
            var navigationMid = angular.element('.navigation-mid');

            var startX, startWidth;

            element.bind('mousedown', initDrag);

            function initDrag(e) {
                startX = e.clientX;
                startWidth = parseInt($window.getComputedStyle(navigationOuter[0], null).width);
                $document.bind('mousemove', doDrag);
                $document.bind('mouseup', stopDrag);
            }

            function doDrag(e) {
                var newWidth = (startWidth + e.clientX - startX);
                if (newWidth < 30)
                    newWidth = 30;

                element.css('left', (newWidth-6) + 'px');
                navigationOuter.css('width', (newWidth) + 'px');
                navigationMid.css('width', (newWidth-6) + 'px');
                content.css('margin-left', (newWidth) + 'px');
            }

            function stopDrag(e) {
                $document.unbind('mousemove', doDrag);
                $document.unbind('mouseup', stopDrag);
            }
        }
    }
})();
