module.exports = function (arg, config, dataTable) {

  var options = _.map(dataTable.data.header, function (header) {
    return {
      name: header,
      value: header
    }
  });

  return {
    key: arg.name,
    type: 'ui-select-single',
    templateOptions: {
      optionsAttr: 'formly-options',
      label: arg.name,
      description: arg.help,
      options: options
    }
  };
};
