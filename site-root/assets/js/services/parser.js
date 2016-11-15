(function() {
    'use strict';

    angular
        .module('api')
        .factory('Parser', Parser);

    function Parser() {
        var factory = {
            parse: parse,
            validate: validate
        };

        return factory;

        function parse(apiDocument) {
        }

        function validate(apiDocument) {
        }
    }
})();