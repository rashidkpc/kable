var _ = require('lodash');
var $ = require('jquery');

require('plugins/kable/form_components/formly/types');

var formComponents = require('./load_forms');
var panelTypes = require('plugins/kable/panels/load');

var template = require('./index.html')

var app = require('ui/modules').get('apps/kable', []);

app.directive('kablePanelConfig', function () {
  return {
    restrict: 'E',
    template: template,
    scope: {
      config: '=configConfig',
      dataPromise: '=configData',
    },
    link: function ($scope, $elem, attrs) {
      $scope.panelTypes = panelTypes;

      $scope.form = [];

      $scope.$watchCollection('config', function () {
        if (!$scope.config.type) return;

        var panelArgs = panelTypes[$scope.config.type].args;

        $scope.dataPromise.then(function (data) {
          $scope.form = _.map(panelArgs, function (arg) {
            return formComponents[arg.type](arg, $scope.config, data);
          });
        });

      })

    }
  };
});
