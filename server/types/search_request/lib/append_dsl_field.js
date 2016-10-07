// Insert either a `field` key, or a `script` key to an aggregation or filter/query
// This should be used every time a field is passed, otherwise you may miss out on
const _ = require('lodash');

module.exports = function (field, obj, searchRequest) {
  const result = {
    field: field
  };

  _.merge(result, obj);
  return result;
};
