angular.module('api').factory('Schema', ['Property', function(Property) {
    var Schema = function(type, ref, attributes) {
        this.type           = type;
        this.ref            = ref;
        this.definition     = attributes;

        if (typeof(this.definition) === 'object') {
            this.definition = new Property(this.definition);
        }
    };

    return Schema;
}]);
