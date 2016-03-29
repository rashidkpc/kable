var _ = require('lodash');
var Type = require('../../lib/type');
var searchRequest = require('../search_request')

module.exports = new Type('dataTable', {
  help: 'A simple array of arrays representing retrieved data',
  methods: {
    getColumn: function(dataTable, name) {
      var index = dataTable.data.header.indexOf(name);
      if (index === -1) throw new Error ('Unknown column: ' + name);

      return _.pluck(dataTable.data.rows, index);
    },
    addColumn: function(dataTable, name, column) {
      if (column.length !== dataTable.data.rows.length) throw new Error ('All columns must be of equal length')

      // So this is cool. _.zip.apply basically toggles between a row structure and a column structure.
      var columns = _.zip.apply(this, dataTable.data.rows);

      var index = dataTable.data.header.indexOf(name);
      if (index < 0) {
        columns.push(column);
        dataTable.data.header.push(name);
      } else {
        columns[index] = column;
      }

      // BLAM, back to rows!
      dataTable.data.rows = _.zip.apply(this, columns);
      return dataTable;
    },
    addRow: function(dataTable, row) {
      if (row.length !== dataTable.data.header.length) throw new Error ('All rows must be of equal length')
      dataTable.data.rows.push(row);

      return dataTable
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
