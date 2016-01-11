var _ = require('lodash');
var Strand = require('../lib/strand');


module.exports = new Strand('first', {
  args: {
    _pipe_: {
      types: ['empty']
    }
  },
  help: 'Just gets the ball rolling',
  fn: function and(args) {
    return args._pipe_;
  }
});