(function() {
    'use strict';

    angular
        .module('api')
        .controller('apiController', apiController);

    apiController.$inject = ['$anchorScroll', '$scope', '$state', '$stateParams', '$timeout', '$filter', 'api', 'Property', 'SchemaRegistry', 'Schema', 'Parser'];

    function apiController($anchorScroll, $scope, $state, $stateParams, $timeout, $filter, api, Property, SchemaRegistry, Schema, Parser) {
        var vm = this;
        var options = {
            specListUrl: 'specs.json',
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

        vm.isJSPrimitive = isJSPrimitive;
        vm.isJSReference = isJSReference;
        vm.isSSReference = isSSReference;
        vm.isSSLiteral = isSSLiteral;
        vm.parameterText = parameterText;
        vm.arrayItemText = arrayItemText;
        vm.objectPropertyText = objectPropertyText;
        vm.copyObject = copyObject;
        vm.hideSchemas = false;
        vm.isBodyList = isBodyList;
        vm.isEmptyObject = isEmptyObject;
        vm.isSchema = isSchema;
        vm.isSchemaRef = isSchemaRef;
        vm.isExpandable = isExpandable;
        vm.hasExpandable = hasExpandable;
        vm.isParameterList = isParameterList;
        vm.isString = isString;
        vm.isArray = isArray;
        vm.toggle = toggle;
        vm.loading = false;
        vm.scrollToMethod = scrollToMethod;
        vm.scrollToSchema = scrollToSchema;
        vm.slugify = slugify;
        vm.spec = null;
        vm.specList = null;
        vm.specUrl = null;
        vm.specName = null;
        vm.toggleFirstResponse = toggleFirstResponse;
        vm.toggleParameterType = toggleParameterType;
        vm.toggleResponse = toggleResponse;
        vm.transformItemsToProperties = transformItemsToProperties;

        activate();

        function activate() {
            $anchorScroll.yOffset = parseInt(angular.element(options.apiContainerSelector).css('padding-top'));
            getApiList();
        }

        function getApiList() {
            if (vm.loding) return;

            vm.loading = true;

            api.get(options.specListUrl)
            .then(function(response) {
              vm.specList = response;

                if (vm.specList.length) {
                    if (!!$stateParams.spec) {
                        var spec = $stateParams.spec.toLowerCase();

                        for (var i = 0, len = vm.specList.length; i < len; i++) {
                            if (vm.slugify(vm.specList[i].name) === spec) {
                                vm.specUrl = vm.specList[i].path;
                                vm.specName = vm.specList[i].name;
                                break;
                            }
                        }
                    }

                    if (!vm.specUrl) {
                        vm.specUrl = vm.specList[0].path;
                        vm.specName = vm.specList[0].name;
                    }

                    $scope.$watch('vm.specUrl', function(newVal, oldVal) {
                        getApiSpecificicationJson(newVal);

                        for (var i = 0, len = vm.specList.length; i < len; i++) {
                            if (vm.specList[i].path === newVal) {
                                vm.specName = vm.specList[i].name;

                                $state.go('apiDeeplink', {
                                    spec: vm.slugify(vm.specName)
                                }, options.stateChangeOptionsWithOverride);

                                break;
                            }
                        }
                    });
                } else {
                    alert('No API specifications found.');
                    vm.loading = false;
                }
            }, function(response) {
                alert('An error occurred while retrieving the list of API specifications');
                vm.loading = false;
            });
        }

        function getApiSpecificicationJson(url) {
            if (vm.loding) return;

            vm.loading = true;
            vm.spec = null;

            $timeout(function() {
                api.get(url)
                .then(function(response) {
                    vm.spec = response;

                    try {
                        Parser.validate(vm.spec);
                    }
                    catch(e) {
                        if (e instanceof Parser.ParseError) {
                            alert('An error occurred while parsing API specifications from ' + url + '\n' + e.message);
                        }
                    }

                    for (var type in vm.spec.schemas) {
                        if (vm.spec.schemas.hasOwnProperty(type)) {
                            for (var key in vm.spec.schemas[type]) {
                                if (vm.spec.schemas[type].hasOwnProperty(key)) {
                                    SchemaRegistry.add(key, new Schema(type, key, vm.spec.schemas[type][key]));
                                }
                            }
                        }
                    }

                    vm.spec.schemas = SchemaRegistry;

                    for (var key in vm.spec.methods) {
                        if (Object.prototype.hasOwnProperty.call(vm.spec.methods, key)) {
                            vm.spec.methods[key] = new Property(vm.spec.methods[key]);
                        }
                    }

                    if (!!$stateParams.section) {
                        _scrollToSection($stateParams.section);
                    }
                }, function(response) {
                    alert('An error occurred while retrieving API specifications from ' + url);
                })['finally'](function() {
                    vm.loading = false;
                });
            });
        }

        function isJSPrimitive(env, field, value) {
            if (env === 'parameter') {
                return false;
            } else if (env === 'arrayItem') {
                if (field === 'value') {
                    if (value.hasOwnProperty('type')) {
                        if (value.type === 'string' && value.hasOwnProperty('format')) {
                            if (typeof value.format === 'string')
                                return false;
                            if (typeof value.format === 'object' && value.format.hasOwnProperty('ref'))
                                return false;
                        }
                        return true;
                    }
                    return false;
                } else
                    return false;
            } else if (env === 'objectProperty') {
                if (field === 'value') {
                    if (value.hasOwnProperty('type')) {
                        if (value.type === 'string' && value.hasOwnProperty('format')) {
                            if (typeof value.format === 'string')
                                return false;
                            if (typeof value.format === 'object' && value.format.hasOwnProperty('ref'))
                                return false;
                        }
                        return true;
                    }
                    return false;
                } else
                    return false;
            } else {
                throw "this should not happen";
            }
        }

        function isJSReference(env, field, value) {
            if (env === 'parameter') {
                return false;
            } else if (env === 'arrayItem') {
                if (field === 'value') {
                    return value.hasOwnProperty('ref');
                } else
                    return false;
            } else if (env === 'objectProperty') {
                if (field === 'value') {
                    return value.hasOwnProperty('ref');
                } else
                    return false;
            } else {
                throw "this should not happen";
            }
        }

        function isSSReference(env, field, value) {
            if (env === 'parameter') {
                if (field === 'name' || field === 'value') {
                    return (typeof value === 'object' && value.hasOwnProperty('ref'));
                }
                return false;
            } else if (env === 'arrayItem') {
                if (field === 'index') {
                    return (typeof value === 'object' && value.hasOwnProperty('ref'));
                } else if (field === 'value') {
                    if (value.hasOwnProperty('type')) {
                        if (value.type === 'string' && value.hasOwnProperty('format')) {
                            if (typeof value.format === 'string')
                                return false;
                            if (typeof value.format === 'object' && value.format.hasOwnProperty('ref'))
                                return true;
                        }
                    }
                    return false;
                } else
                    return false;
            } else if (env === 'objectProperty') {
                if (field === 'key') {
                    return (typeof value === 'object' && value.hasOwnProperty('ref'));
                } else if (field === 'value') {
                    if (value.hasOwnProperty('type')) {
                        if (value.type === 'string' && value.hasOwnProperty('format')) {
                            if (typeof value.format === 'string')
                                return false;
                            if (typeof value.format === 'object' && value.format.hasOwnProperty('ref'))
                                return true;
                        }
                    }
                    return false;
                } else
                    return false;
            } else {
                throw "this should not happen";
            }
        }

        function isSSLiteral(env, field, value) {
            if (env === 'parameter') {
                if (field === 'name' || field === 'value') {
                    return (typeof value === 'string');
                }
                return false;
            } else if (env === 'arrayItem') {
                if (field === 'index') {
                    return (typeof value === 'string');
                } else if (field === 'value') {
                    if (value.hasOwnProperty('type')) {
                        if (value.type === 'string' && value.hasOwnProperty('format')) {
                            if (typeof value.format === 'string')
                                return true;
                            if (typeof value.format === 'object' && value.format.hasOwnProperty('ref'))
                                return false;
                        }
                    }
                    return false;
                } else
                    return false;
            } else if (env === 'objectProperty') {
                if (field === 'key') {
                    return (typeof value === 'string');
                } else if (field === 'value') {
                    if (value.hasOwnProperty('type')) {
                        if (value.type === 'string' && value.hasOwnProperty('format')) {
                            if (typeof value.format === 'string')
                                return true;
                            if (typeof value.format === 'object' && value.format.hasOwnProperty('ref'))
                                return false;
                        }
                    }
                    return false;
                } else
                    return false;
            } else {
                throw "this should not happen";
            }
        }

        function getJSShortText(js) {
            if (js.hasOwnProperty('ref')) {
                return js.ref;
            }

            if (js.type === 'string' && js.hasOwnProperty('format')) {
                if (typeof js.format === 'string')
                    return JSON.stringify(js.format);
                if (typeof js.format === 'object' && js.format.hasOwnProperty('ref'))
                    return js.format.ref;
            }

            return js.type;
        }

        function getSSShortText(ss) {
            if (typeof ss === 'string') {
                return JSON.stringify(ss);
            }

            if (ss.hasOwnProperty('ref')) {
                return ss.ref;
            }

            return 'string';
        }

        function parameterText(property, field) {
            if (field === 'frequency' || field === 'description') {
                return property;
            }

            return getSSShortText(property);
        }

        function arrayItemText(property, field) {
            if (field === 'index' || field === 'description') {
                return property;
            }

            return getJSShortText(property);
        }

        function objectPropertyText(property, field) {
            if (field === 'frequency' || field === 'description') {
                return property;
            }

            if (field === 'key') {
                return getSSShortText(property);
            }

            return getJSShortText(property);
        }

        function isBodyList(requestType) {
            return requestType.toLowerCase() === 'body';
        }

        function copyObject(obj) {
            return angular.copy(obj);
        }

        function isEmptyObject(obj) {
            return angular.equals({}, obj);
        }

        function isSchema(property) {
            return (property instanceof(Schema));
        }

        function isSchemaRef(property) {
            return (property !== null && typeof(property) === 'object' && property.hasOwnProperty('ref'));
        }

        function isExpandable(property) {
            return (typeof(property) === 'object');
        }

        function hasExpandable(parameter) {
            for (var key in parameter) {
                if (parameter.hasOwnProperty(key) && isExpandable(parameter[key])) {
                    return true;
                }
            }

            return false;
        }

        function isParameterList(requestType) {
            return ['path', 'query', 'header'].indexOf(requestType.toLowerCase()) !== -1;
        }

        function isString(input) {
            return typeof input === 'string';
        }

        function isArray(input) {
            return angular.isArray(input);
        }

        function initSchemaRef(property) {
            if (!property.schema) {
                property.schema = angular.copy(SchemaRegistry.find(property.ref));
                console.log(property.schema);
            }
        }

        function toggle(property) {
            if (isSchemaRef(property)) {
                // initSchemaRef(property);
            } else if (typeof(property) === 'object') {
                for (var key in property) {
                    if (property.hasOwnProperty(key)) {
                        if (isSchemaRef(property[key])) {
                            // initSchemaRef(property[key]);
                        }
                    }
                }
            }

            property.__show = !property.__show;
        }

        function scrollToMethod(section, method, overrideState) {
            var id = section.name;
            section.__hide = false;

            if (method) {
                id += '-' + method.method + '-' + method.location;
                method.__hide = false;
            }

            $state.go('apiDeeplink', {
                spec: vm.slugify(vm.specName),
                section: vm.slugify(id)
            }, overrideState ? options.stateChangeOptionsWithOverride : options.stateChangeOptions);

            $timeout(function() {
                $anchorScroll(vm.slugify(id));
            });
        }

        function scrollToSchema(name, overrideState) {
            if (!name) {
                return;
            }

            var slug = 'schemas',
                schema = vm.spec.schemas.find(name);
            vm.hideSchemas = false;


            if (typeof(schema) !== 'undefined') {
                schema.__show = true;
                slug = 'schema-' + vm.slugify(schema.name);

                $state.go('apiDeeplink', {
                    spec: vm.slugify(vm.specName),
                    section: slug
                }, overrideState ? options.stateChangeOptionsWithOverride : options.stateChangeOptions);

                $timeout(function() {
                    $anchorScroll(slug);
                });
            }
        }

        function slugify(str) {
            return str.toString().toLowerCase()
                .replace(/\s+/g, '-')       // Replace spaces with -
                .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
                .replace(/\-\-+/g, '-')     // Replace multiple - with single -
                .replace(/^-+/, '')         // Trim - from start of text
                .replace(/-+$/, '');        // Trim - from end of text
        }

        function toggleFirstResponse(index, responses, response) {
            if (index === 0) {
                vm.toggleResponse(responses, response);
            }
        }

        function toggleParameterType(requestObj, requestType) {
            for (var key in requestObj) {
                if (requestObj.hasOwnProperty(key)) {
                    requestObj[key].__hide = true;
                }
            }

            requestObj[requestType].__hide = false;
        }

        function toggleResponse(responses, response) {
            responses.map(function(response) {
                response.__hide = true;
            });

            response.__hide = false;
        }

        function transformItemsToProperties(items) {
            return items.map(function(item) {
                item.isArrayIndex = true;
                item.key = item.index;
                return item;
            });
        }

        function _scrollToSection(section) {
            section = section.toLowerCase();

            var schemas = [];
            for (var key in vm.spec.schemas.json) {
                if (vm.spec.schemas.json.hasOwnProperty(key) && ('schema-' + vm.slugify(key)) === section) {
                    vm.scrollToSchema(key, true);
                    return;
                }
            }
            
            for (var i = 0, len = vm.spec.sections.length; i < len; i++) {
                if (vm.slugify(vm.spec.sections[i].name) === section) {
                    vm.scrollToMethod(vm.spec.sections[i], null, true);
                    return;
                }
            }

            for (var j = 0, lenJ = vm.spec.sections.length; j < lenJ; j++) {
                for (var k = 0, lenK = vm.spec.sections[j].methods.length; k < lenK; k++) {
                    if (vm.slugify(vm.spec.sections[j].name + '-' + vm.spec.sections[j].methods[k]) === section && vm.spec.methods[vm.spec.sections[j].methods[k]]) {
                        vm.scrollToMethod(vm.spec.sections[j], vm.spec.methods[vm.spec.sections[j].methods[k]], true);
                        return;
                    }
                }
            }
        }
    }
})();
