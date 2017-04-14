(function() {
    'use strict';

    angular
        .module('app')
        .filter('escapeID', escapeID);

    // https://www.w3.org/TR/html4/types.html#type-id
    // ID and NAME tokens must begin with a letter ([A-Za-z]) and 
    // may be followed by any number of letters, digits ([0-9]), hyphens ("-"), 
    // underscores ("_"), colons (":"), and periods (".").
    // we avoid colons and periods to simplify CSS selectors

    function escapeID() {
        var printable = /[-a-zA-Z0-9]/;

        function escapeString(input) {
            var chunks = [],
                i = 0,
                j = 0;
            while (j !== input.length) {
                if (! (input[j].match(printable))) {
                    if (i!==j) {
                        chunks.push(input.slice(i,j));
                    }
                    chunks.push('_');
                    chunks.push((input[j].charCodeAt(0)+65536).toString(16).toUpperCase().slice(1));
                    i = j + 1;
                }
                j = j + 1;
            }
            if (i!==j) {
                chunks.push(input.slice(i,j));
            }
            return chunks.join('');
        }

        return function(input) {
            if (angular.isArray(input)) {
                var chunks = [];
                for (var i=0; i!==input.length; ++i) {
                    chunks.push(escapeString(input[i]));
                }
                return 'x-' + chunks.join('__');
            } else if (angular.isString(input)) {
                return 'x-' + escapeString(input);
            } else {
                // TODO this should not happen
                return '';
            }
        };
    }
})();
