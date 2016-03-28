module.exports = function (arg, config, dataTable) {
  return {
    key: arg.name,
    type: 'horizontalInput',
    templateOptions: {
      inputType: 'number',
      label: arg.name,
      placeholder: arg.help,
    }
  };
};
