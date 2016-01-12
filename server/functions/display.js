var _ = require('lodash');
var Strand = require('../lib/strand');


module.exports = new Strand('display', {
  args: {
    _pipe_: {
      types: ['dataTable']
    },
    display: {
      types: ['string']
    },
    _default_: {
      types: ['string', 'number']
    }
  },
  help: 'Specify the index to search',
  fn: function display(args, kblConfig) {
    var output = args._pipe_;
    output._panel = {
      type: args.display,
    };

    return output;
  }
});