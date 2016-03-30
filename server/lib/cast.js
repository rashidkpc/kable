var _ = require('lodash');
var argType = require('./arg_type');

module.exports = function (types, kblConfig) {
  return function (arg, allowedTypes) {
    // The supplied argument types must be defined in ./types
    var suppliedType = argType(arg);
    var suppliedTypeDef = types[suppliedType];

    if (!suppliedTypeDef) throw 'Undefined argument type "' + suppliedType;

    // If the argument accepts this type, simply return the supplied argument value
    if (_.contains(allowedTypes, suppliedType)) return arg;

    var result;
    // Otherwise, try to cast it,
    // Check the supplied type's "to" functions first, followed by the required types' "from" functions
    _.each(allowedTypes, function (allowedType) {
      var allowedTypeDef = types[allowedType];

      if (suppliedTypeDef.to[allowedType]) result = suppliedTypeDef.to[allowedType](arg, kblConfig);
      if (allowedTypeDef.from[suppliedType]) result = allowedTypeDef.from[suppliedType](arg, kblConfig);
    })

    if (_.isUndefined(result)) throw 'Could not cast ' + suppliedType + ' to any of ' + allowedTypes.join(', ');

    return result;
  }
}
