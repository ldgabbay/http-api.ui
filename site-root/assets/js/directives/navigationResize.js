(function() {
    'use strict';

    angular
        .module('api')
        .directive('navigationResize', navigationResize);

    navigationResize.$inject = ['$document'];

    function navigationResize($document) {
        var active = false;
        var content = angular.element('.content');
        var navigation = angular.element('.navigation-outer, .navigation-mid');
        var directive = {
            link: link,
            restrict: 'AE'
        };

        return directive;

        function link(scope, element, attrs) {
            element.bind('mousedown', function(e) {
                active = true;
            });

            $document.bind('mousemove', function(e) {
                if (active && e.pageX >= 3) {
                    var xOffset = e.pageX + 'px';

                    element.css('left', xOffset);
                    navigation.css('width', xOffset);
                    content.css('margin-left', xOffset);
                }
            });

            $document.bind('mouseup', function(e) {
                active = false;
            });
        }
    }
})();