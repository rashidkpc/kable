module.exports = function(dataTable, column) {
  var index = dataTable.data.header.indexOf(column);
  if (index === -1) throw new Error ('Unknown column: ' + column);

  return _.pluck(dataTable.data.rows, index);
}
