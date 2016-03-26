// Insert either a `field` key, or a `script` key to an aggregation or filter/query
// This should be used every time a field is passed, otherwise you may miss out on
var getFieldScript = require('./get_field_script');
var _ = require('lodash');

module.exports = function (field, obj, searchRequest) {
  var result = {
    script: {
      script: getFieldScript(field, searchRequest),
      lang: 'javascript'
    }
  }

  _.merge(result, obj);
  return result;
}
