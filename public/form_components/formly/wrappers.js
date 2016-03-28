require('ui-select');

var app = require('ui/modules').get('apps/kable', [
  require('angular-formly'),
  require('angular-formly-templates-bootstrap'),
  require('angular-ui-bootstrap'),
  'ui.select'
]);

app.config(function (formlyConfigProvider) {

  formlyConfigProvider.setWrapper({
    name: 'horizontalBootstrapLabel',
    template: [
      '<label for="{{::id}}" class="col-sm-1 control-label">',
        '{{to.label}} {{to.required ? "*" : ""}}',
      '</label>',
      '<div class="col-sm-10">',
        '<formly-transclude></formly-transclude>',
      '</div>'
    ].join(' ')
  });

  formlyConfigProvider.setWrapper({
    name: 'horizontalBootstrapCheckbox',
    template: [
      '<div class="col-sm-offset-2 col-sm-10">',
        '<formly-transclude></formly-transclude>',
      '</div>'
    ].join(' ')
  });

});
