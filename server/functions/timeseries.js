var _ = require('lodash');
var Strand = require('../lib/strand');
var addAgg = require('../lib/add_agg');


module.exports = new Strand('index', {
  args: {
    _pipe_: {
      types: ['searchRequest']
    },
    timeseries: {
      types: ['string']
    },
    interval: {
      types: ['string', 'number', 'null']
    },
    format: {
      types: ['string', 'null']
    }
  },
  help: 'Create a timeseries',
  fn: function top(args, kblConfig) {
    return addAgg({
      searchRequest: args._pipe_,
      newContext: true,
      name: 'time_' + args.timeseries.replace('.', '_'),
      agg: {
        date_histogram: {
          field: args.timeseries,
          interval: args.interval || '1d'
        }
      }
    });
  }
});