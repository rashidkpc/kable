var _ = require('lodash');
var Strand = require('../lib/strand');


module.exports = new Strand('index', {
  args: {
    _pipe_: {
      types: ['searchRequest']
    },
    index: {
      types: ['string']
    }
  },
  help: 'Specify the index to search',
  fn: function index(args, kblConfig) {
    var output = args._pipe_;
    output.request.index = args.index;
    return output;
  }
});