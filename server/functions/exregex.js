var _ = require('lodash');
var Strand = require('../lib/strand');
var getFieldScript = require('../types/search_request').methods.getFieldScript;

module.exports = new Strand('exregex', {
  args: [
    {
      name: '_input_',
      types: ['searchRequest']
    },
    {
      name: 'src',
      types: ['string']
    },
    {
      name: 'regex',
      types: ['string'],
    },
    {
      name: 'index',
      types: ['number']
    },
    {
      name: 'dest',
      types: ['string']
    },
  ],
  help: 'Make with the querying',
  fn: function search (args, kblConfig) {

    // TODO
    var output = args._input_;
    var field = getFieldScript(args.src, args._input_);
    output.scripts = output.scripts || {};
    output.scripts[args.dest] = `(function () {
      var result = ${field};
      result = result.match(${args.regex}) || [];
      return result[${args.index + 1}]
    }())`;


    return output;
  }
});
