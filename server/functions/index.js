var _ = require('lodash');
var Strand = require('../lib/strand');

module.exports = new Strand('index', {
  args: [
    {
      name: '_input_',
      types: ['searchRequest']
    },
    {
      name: 'index',
      types: ['string'],
      multi: true
    }
  ],
  help: 'Specify the index to search',
  fn: function index(args, kblConfig) {
    var output = args._input_;
    output.request.index = args.index;
    return output;
  }
});
