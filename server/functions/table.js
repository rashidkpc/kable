var _ = require('lodash');
var Strand = require('../lib/strand');
var addAgg = require('../lib/add_agg');

module.exports = new Strand('index', {
  args: {
    _pipe_: {
      types: ['dataTable']
    },
    table: {
      types: ['array']
    },
    as: {
      types: ['array', 'null']
    }
  },
  help: 'Specify the index to search',
  fn: function stats(args, kblConfig) {
    var output = args._pipe_;
    args.as = args.as || args.table;

    if (args.as.length != args.table.length) throw new Error ('"as" must contain a name for every field in the table');

    var oldRows = output.data.rows;
    var newRows = new Array(oldRows.length);

    var oldHeader = output.data.header;
    var newHeader = [];

    _.each(args.table, function (column, i) {
      var index = oldHeader.indexOf(column);
      if (index === -1) throw new Error ('Unknown column: ' + column);

      newHeader.push(args.as[i]);

      _.each(oldRows, function (row, i) {
        newRows[i] = newRows[i] || [];
        newRows[i].push(row[index]);
      })
    })

    output.data.rows = newRows;
    output.data.header = newHeader;

    return output;

  }
});