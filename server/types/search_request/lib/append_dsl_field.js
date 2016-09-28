// Insert either a `field` key, or a `script` key to an aggregation or filter/query
// This should be used every time a field is passed, otherwise you may miss out on
const getFieldScript = require('./get_field_script');
const _ = require('lodash');

module.exports = function (field, obj, searchRequest) {
  /*
  var result = {
    script: {
      script: getFieldScript(field, searchRequest),
      lang: 'javascript'
    }
  }
  */
  const result = {
    field: field
  };

  _.merge(result, obj);
  return result;
};
