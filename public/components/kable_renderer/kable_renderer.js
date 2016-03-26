var _ = require('lodash');
var $ = require('jquery');

var app = require('ui/modules').get('apps/timelion', []);

var panels = require('plugins/kable/panels/load');
var template = require('./kable_renderer.html');

app.directive('kableRenderer', function ($compile, Private, $rootScope) {
  return {
    restrict: 'E',
    scope: {
      dataPromise: '=rendererData',
      rendererConfig: '='
    },
    template: template,
    link: function ($scope, $elem, attrs) {

      var panelScope = $rootScope.$new();

      $scope.panels = panels;
      $scope.forceType = Boolean(attrs.type);

      $scope.input = {
        panel: $scope.forceType ? panels[attrs.type] : panels['table']
      }

      function render () {
        var visContainer = $('.kable-vis', $elem);

        panelScope.$destroy();

        if (!$scope.dataPromise) return;
        if (!$scope.input.panel) return;

        panelScope = $rootScope.$new();

        var renderFn = $scope.input.panel.render;

        $scope.dataPromise.then(function (dataObj) {
          visContainer.empty();
          Private(renderFn)(panelScope, visContainer, dataObj);
        });
      }

      $scope.$watch('input.panel', render);
      $scope.$watch('dataPromise', render);
    }
  };
});
