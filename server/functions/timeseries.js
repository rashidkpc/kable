var _ = require('lodash');
var Strand = require('../lib/strand');
var searchRequest = require('../types/search_request');


module.exports = new Strand('timeseries', {
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
      name: 'interval',
      types: ['string', 'number', 'null']
    },
    {
      name: 'format',
      types: ['string', 'null']
    }
  ],
  help: 'Create a timeseries',
  fn: function timeseries(args, kblConfig) {
    var dateHistogramConfig = searchRequest.methods.appendDslField(args.field, {interval: args.interval || '1d'}, args._input_);

    return searchRequest.methods.addAgg({
      searchRequest: args._input_,
      newContext: true,
      name: 'time_' + args.field.replace('.', '_'),
      agg: {
        date_histogram: dateHistogramConfig
      }
    });
  }
});
