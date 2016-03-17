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
      name: 'count',
      types: ['number']
    }
  ],
  help: 'Specify the index to search',
  fn: function top(args, kblConfig) {
    return addAgg({
      searchRequest: args._input_,
      newContext: true,
      name: 'bottom-' + args.field.replace('.', '_'),
      agg: {
        terms: {
          field: args.field,
          size: args.count,
          order: {_count: 'asc'}
        }
      }
    });
  }
});
