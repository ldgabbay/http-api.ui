angular.module('api').factory('Property', ['SchemaRegistry', function(SchemaRegistry) {
    var Property = function(attributes) {

        for (var property in attributes) {
            if (attributes.hasOwnProperty(property)) {
                if (property === 'ref') {
                    this[property] = SchemaRegistry.find(attributes[property]);
                } else if (typeof(attributes[property]) === 'object') {
                    this[property] = new Property(attributes[property]);
                } else {
                    this[property] = attributes[property];
                }
            }
        }
    };

    return Property;
}]);
