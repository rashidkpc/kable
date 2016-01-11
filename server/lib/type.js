var _ = require('lodash');

module.exports = function Type (name, config) {
  this.name = name;

  this.help = config.help || '';
  this.from = config.from || {};
  this.to = config.to || {};

};