module.exports = function (arg, config, dataTable) {
  return {
    key: arg.name,
    type: 'horizontalInput',
    templateOptions: {
      inputType: 'text',
      label: arg.name,
      placeholder: arg.help,
    }
  };
};
