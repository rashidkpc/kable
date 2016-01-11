var _ = require('lodash');

module.exports = function Strand (name, config) {
  this.name = name;

  // Consider making args optional and allowing functions to implement their own parsers
  // as long as they don't conflict with ours?

  this.args = config.args || {};
  this.help = config.help || '';
  this.fn = config.fn;
};