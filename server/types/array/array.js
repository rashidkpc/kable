var _ = require('lodash');
var Type = require('../../lib/type');
var searchRequest = require('../search_request/search_request')

module.exports = new Type('dataTable', {
  help: 'A simple array of arrays representing retrieved data',
  from: {
    // If there is no expression
    string: function (inputString) {
      return _.map(inputString.split(','), function (elem) {
        return  elem.trim();
      });
    }
  }
});