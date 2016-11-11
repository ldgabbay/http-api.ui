angular.module('api').factory('Property', ['SchemaRegistry', function(SchemaRegistry) {
    // Property is now essentially a "helper" rather than a type. TODO: Refactor.
    var Property = function(attributes) {
        var data = angular.isArray(attributes) ? [] : {};

        for (var property in attributes) {
            if (attributes.hasOwnProperty(property)) {
                if (typeof(attributes[property]) === 'object') {
                    data[property] = new Property(attributes[property]);
                } else {
                    data[property] = attributes[property];
                }
            }
        }

        return data;
    };

    return Property;
}]);
