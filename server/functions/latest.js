var _ = require('lodash');
var Strand = require('../lib/strand');
var searchRequest = require('../types/search_request');

module.exports = new Strand('latest', {
  args: [
    {
      name: '_input_',
      types: ['searchRequest']
    },
    {
      name: 'field',
      types: ['string']
    },
    {
      name: 'by',
      types: ['string']
    }
  ],
  help: 'Get the latest value of some field',
  fn: function latest(args, kblConfig) {

    console.log('1');


    var agg = {};

    var sortObj = {_script: {}};
    sortObj._script = searchRequest.methods.appendDslField(args.by, {type: 'number', order: 'desc'}, args._input_);

    console.log('2');

    var scriptFieldsObj = {};
    scriptFieldsObj[args.field.replace('.', '_')] = searchRequest.methods.appendDslField(args.field, {}, args._input_);

    console.log('3');


    agg['top_hits'] = {
      size: 1,
      sort: sortObj,
      script_fields: scriptFieldsObj
    };


    searchRequest.methods.addAgg({
      searchRequest: args._input_,
      newContext: false,
      name: 'latest',
      agg: agg
    });

    return args._input_;

  }
});
