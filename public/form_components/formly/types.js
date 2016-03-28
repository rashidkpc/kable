require('./wrappers');
require('ui-select');
require('ui-select/dist/select.css');

var app = require('ui/modules').get('apps/kable', [require('angular-formly'), require('angular-formly-templates-bootstrap'), 'ui.select']);

app.config(function (formlyConfigProvider) {

  formlyConfigProvider.setType({
    name: 'horizontalInput',
    extends: 'input',
    wrapper: ['horizontalBootstrapLabel', 'bootstrapHasError']
  });

  formlyConfigProvider.setType({
    name: 'horizontalSelect',
    extends: 'select',
    wrapper: ['horizontalBootstrapLabel', 'bootstrapHasError']
  });

  formlyConfigProvider.setType({
    name: 'horizontalCheckbox',
    extends: 'checkbox',
    wrapper: ['horizontalBootstrapCheckbox', 'bootstrapHasError']
  });

  // UI Select types
  formlyConfigProvider.setType({
    name: 'ui-select-single',
    extends: 'horizontalSelect',
    template: `
    <ui-select ng-model="model[options.key]" theme="bootstrap" ng-required="{{to.required}}" ng-disabled="{{to.disabled}}" reset-search-input="false">
      <ui-select-match placeholder="{{to.placeholder}}"> {{$select.selected.name}} </ui-select-match>
      <ui-select-choices group-by="to.groupBy" repeat="option.value as option in to.options | filter: $select.search">
        <div>{{option.name | highlight: $select.search}}</div>
      </ui-select-choices>
    </ui-select>
    `
  });

  formlyConfigProvider.setType({
    name: 'ui-select-multiple',
    extends: 'horizontalSelect',
    template: `
    <ui-select multiple ng-model="model[options.key]" theme="bootstrap" ng-required="{{to.required}}" ng-disabled="{{to.disabled}}">
      <ui-select-match placeholder="{{to.placeholder}}">{{$item.name}}</ui-select-match>
      <ui-select-choices repeat="option.value as option in to.options | filter: $select.search">
        <div>{{option.name | highlight: $select.search}}</div>
      </ui-select-choices>
    </ui-select>
    `
  });

});
