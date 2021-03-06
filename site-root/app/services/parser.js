(function() {
    'use strict';

    angular
        .module('app')
        .factory('Parser', Parser);

    function Parser() {
        function Visitor(hapi) {
            this.hapi = hapi;
        }

        Visitor.prototype = {
            exitSection: function(obj) {
                var self = this;
                obj.methods = obj.methods.map(function(tag) {
                    return self.hapi.methods[tag];
                });
            },
            exitMethod: function(obj) {
                var requestHasPath = obj.request.path && obj.request.path.length;
                var requestHasQuery = obj.request.query && obj.request.query.length;
                var requestHasHeader = obj.request.header && obj.request.header.length;
                var requestHasBody = obj.request.body && obj.request.body.length;
                obj.hasRequest = (requestHasPath || requestHasQuery || requestHasHeader || requestHasBody);
            },
            exitLiteralSS: function(obj) {
                obj.shortTextClass = 'literal-ss';
                obj.shortText = JSON.stringify(obj.value);

                obj.isExpandable = false;
                obj.extendedView = null;
            },
            exitGeneralSS: function(obj) {
                obj.shortTextClass = 'primitive-ss';
                obj.shortText = 'string';

                if (obj.description || obj.criteria || obj.examples) {
                    obj.isExpandable = true;
                    obj.extendedView = 'app/directives/hapi-schema-extended/general-ss.html';
                } else {
                    obj.isExpandable = false;
                    obj.extendedView = null;
                }
            },
            exitReferenceSS: function(obj) {
                obj.refObj = this.hapi.schemas.string[obj.ref];

                obj.shortTextClass = 'reference-ss';
                obj.shortText = obj.ref;

                obj.isExpandable = true;
                obj.extendedView = 'app/directives/hapi-schema-extended/reference-ss.html';
            },
            exitOneOfSS: function(obj) {
                obj.shortTextClass = 'primitive-ss';
                obj.shortText = 'oneOf';

                obj.isExpandable = true;
                obj.extendedView = 'app/directives/hapi-schema-extended/one-of-ss.html';
            },
            exitReferenceJS: function(obj) {
                obj.refObj = this.hapi.schemas.json[obj.ref];

                obj.shortTextClass = 'reference-js';
                obj.shortText = obj.ref;

                obj.isExpandable = true;
                obj.extendedView = 'app/directives/hapi-schema-extended/reference-js.html';
            },
            exitStringReferenceJS: function(obj) {
                obj.refObj = this.hapi.schemas.string[obj.sref];

                obj.shortTextClass = 'reference-ss';
                obj.shortText = obj.sref;

                obj.isExpandable = true;
                obj.extendedView = 'app/directives/hapi-schema-extended/reference-ss.html';
            },
            exitOneOfJS: function(obj) {
                obj.shortTextClass = 'primitive-js';
                obj.shortText = 'oneOf';

                obj.isExpandable = true;
                obj.extendedView = 'app/directives/hapi-schema-extended/one-of-js.html';
            },
            exitLiteralJS: function(obj) {
                obj.shortTextClass = 'literal-js';
                obj.shortText = JSON.stringify(obj.value);
                
                obj.isExpandable = false;
                obj.extendedView = null;
            },
            exitNullJS: function(obj) {
                obj.shortTextClass = 'primitive-js';
                obj.shortText = 'null';

                if (obj.description) {
                    obj.isExpandable = true;
                    obj.extendedView = 'app/directives/hapi-schema-extended/null-js.html';
                } else {
                    obj.isExpandable = false;
                    obj.extendedView = null;
                }
            },
            exitBooleanJS: function(obj) {
                obj.shortTextClass = 'primitive-js';
                obj.shortText = 'boolean';

                if (obj.description) {
                    obj.isExpandable = true;
                    obj.extendedView = 'app/directives/hapi-schema-extended/boolean-js.html';
                } else {
                    obj.isExpandable = false;
                    obj.extendedView = null;
                }
            },
            exitNumberJS: function(obj) {
                obj.shortTextClass = 'primitive-js';
                obj.shortText = 'number';

                if (obj.description || obj.criteria || obj.examples) {
                    obj.isExpandable = true;
                    obj.extendedView = 'app/directives/hapi-schema-extended/number-js.html';
                } else {
                    obj.isExpandable = false;
                    obj.extendedView = null;
                }
            },
            exitStringJS: function(obj) {
                if (obj.description) {
                    obj.shortTextClass = 'primitive-js';
                    obj.shortText = 'string';
                    obj.isExpandable = true;
                    obj.extendedView = 'app/directives/hapi-schema-extended/string-js.html';
                } else {
                    if (obj.format) {
                        obj.shortTextClass = obj.format.shortTextClass;
                        obj.shortText = obj.format.shortText;
                        obj.isExpandable = obj.format.isExpandable;
                        obj.extendedView = 'app/directives/hapi-schema-extended/format-string-js.html'; // TODO obj.format.extendedView;
                    } else {
                        obj.shortTextClass = 'primitive-js';
                        obj.shortText = 'string';
                        obj.isExpandable = false;
                        obj.extendedView = null;
                    }
                }
            },
            exitArrayJS: function(obj) {
                obj.shortTextClass = 'primitive-js';
                obj.shortText = 'array';

                if (obj.arrayType === 'simple') {
                    // obj.shortTextClass = obj.items.shortTextClass;
                    obj.shortText = "array<" + obj.items.shortText + ">";

                    if (obj.description || obj.criteria || obj.examples || obj.items.isExpandable) {
                        obj.isExpandable = true;
                        obj.extendedView = 'app/directives/hapi-schema-extended/simple-array-js.html';
                    } else {
                        obj.isExpandable = false;
                        obj.extendedView = null;
                    }
                } else if (obj.arrayType === 'record') {
                    if (obj.description || obj.criteria || obj.examples || obj.items.length !== 0) {
                        obj.isExpandable = true;
                        obj.extendedView = 'app/directives/hapi-schema-extended/record-array-js.html';
                    } else {
                        obj.isExpandable = false;
                        obj.extendedView = null;
                    }
                }
            },
            exitObjectJS: function(obj) {
                obj.shortTextClass = 'primitive-js';
                obj.shortText = 'object';

                if (obj.description || obj.criteria || obj.examples || obj.properties.length !== 0) {
                    obj.isExpandable = true;
                    obj.extendedView = 'app/directives/hapi-schema-extended/object-js.html';
                } else {
                    obj.isExpandable = false;
                    obj.extendedView = null;
                }
            },
            exitApiDocument: function(obj) {
                obj.schemaTags = {
                    string: Object.getOwnPropertyNames(obj.schemas.string).sort(),
                    json: Object.getOwnPropertyNames(obj.schemas.json).sort(),
                };

                for(var i in obj.sections) {
                    obj.sections[i].index = i;
                }

                for(var key in obj.methods) {
                    if(obj.methods.hasOwnProperty(key)) {
                        obj.methods[key].tag = key;
                    }
                }
            }
        };

        function parse(httpapiSpec) {
            Hapi.validate(httpapiSpec);
            var hapi = Hapi.parse(httpapiSpec);
            var visitor = new Visitor(hapi);
            hapi.accept(visitor);
            return visitor.hapi;
        }

        return {
            parse: parse,
            ParseError: Hapi.ParseError
        };
    }
})();
