var _ = require('lodash');
var Type = require('../../lib/type');
var searchRequest = require('../search_request')

module.exports = new Type('dataTable', {
  help: 'A simple array of arrays representing retrieved data',
  methods: {
    getColumn: function(dataTable, column) {
      var index = dataTable.data.headers.indexOf(column);
      if (index === -1) throw new Error ('Unknown column: ' + column);

      return _.pluck(dataTable.data.rows, index);
    },
    addColumns: function(dataTable, name, arr, index) {
      throw new Error ('Not implemented')
    }
  },
  from: {
    // If there is no expression
    null: function () {
      var request = searchRequest.from.null();
      return searchRequest.to.dataTable(request);
    }
  }
});
