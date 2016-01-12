var _ = require('lodash');
var Type = require('../../lib/type');
var elasticsearch = require('elasticsearch');

module.exports = new Type('number', {
  help: 'Any numeric type'
});