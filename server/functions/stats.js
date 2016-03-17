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
      types: ['array']
    },
    {
      name: 'field',
      types: ['string']
    }
  ],
  help: 'Specify the index to search',
  fn: function stats(args, kblConfig) {

    _.each(args.field, function (stat) {
      var agg = {};
      agg[stat] = {field: args.field}
      addAgg({
        searchRequest: args._input_,
        newContext: false,
        name: stat + '_' + args.field.replace('.', '_'),
        agg: agg
      });
    })

    return args._input_;

  }
});
