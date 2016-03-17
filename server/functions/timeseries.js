var _ = require('lodash');
var Strand = require('../lib/strand');
var addAgg = require('../lib/add_agg');


module.exports = new Strand('index', {
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
  fn: function top(args, kblConfig) {
    return addAgg({
      searchRequest: args._input_,
      newContext: true,
      name: 'time_' + args.field.replace('.', '_'),
      agg: {
        date_histogram: {
          field: args.field,
          interval: args.interval || '1d'
        }
      }
    });
  }
});
