var _ = require('lodash');
var Strand = require('../lib/strand');
var addAgg = require('../lib/add_agg');

module.exports = new Strand('index', {
  args: {
    _pipe_: {
      types: ['searchRequest']
    },
    stats: {
      types: ['array']
    },
    field: {
      types: ['string']
    }
  },
  help: 'Specify the index to search',
  fn: function stats(args, kblConfig) {

    _.each(args.stats, function (stat) {
      var agg = {};
      agg[stat] = {field: args.field}
      addAgg({
        searchRequest: args._pipe_,
        newContext: false,
        name: stat + '_' + args.field.replace('.', '_'),
        agg: agg
      });
    })

    return args._pipe_;

  }
});