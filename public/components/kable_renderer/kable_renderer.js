var _ = require('lodash');
var $ = require('jquery');

var app = require('ui/modules').get('apps/timelion', []);

var panels = require('plugins/kable/panels/load');
var template = require('./kable_renderer.html');

app.directive('kableRenderer', function ($compile, Private, $rootScope) {
  return {
    restrict: 'A',
    scope: {
      dataObj: '=kableRenderer',
    },
    template: template,
    link: function ($scope, $elem, attrs) {

      var panelScope = $rootScope.$new();
      var visContainer = $('.kable-vis', $elem);

      $scope.panels = panels;
      $scope.forceType = Boolean(attrs.type);

      $scope.input = {
        panel: $scope.forceType ? panels[attrs.type] : panels['table']
      }

      function render () {
        panelScope.$destroy();
        visContainer.empty();

        if (!$scope.dataObj) return;
        if (!$scope.input.panel) return;

        panelScope = $rootScope.$new();

        var renderFn = $scope.input.panel.render;
        var panelDataObj = angular.copy($scope.dataObj);
        Private(renderFn)(panelScope, visContainer, panelDataObj);
      }

      $scope.$watch('input.panel', render);
      $scope.$watch('dataObj', render);
    }
  };
});
