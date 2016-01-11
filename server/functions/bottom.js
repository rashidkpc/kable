var _ = require('lodash');
var Strand = require('../lib/strand');
var addAgg = require('../lib/add_agg');

module.exports = new Strand('index', {
  args: {
    _pipe_: {
      types: ['searchRequest']
    },
    bottom: {
      types: ['string']
    },
    count: {
      types: ['number']
    }
  },
  help: 'Specify the index to search',
  fn: function top(args, kblConfig) {
    return addAgg({
      searchRequest: args._pipe_,
      newContext: true,
      name: 'bottom-' + args.bottom.replace('.', '_'),
      agg: {
        terms: {
          field: args.bottom,
          size: args.count,
          order: {_count: 'asc'}
        }
      }
    });
  }
});