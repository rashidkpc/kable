var _ = require('lodash');
var $ = require('jquery');

var app = require('ui/modules').get('apps/timelion', []);

var panelContext = require.context("../panels", true, /^\.\/[^\/]+\/index\.js$/);
var panels = _.chain(panelContext.keys())
    .map(function (panelPath) { return panelContext(panelPath); })
    .indexBy('name')
    .value();

app.directive('kableRenderer', function ($compile, Private, $rootScope) {
  return {
    restrict: 'A',
    scope: {
      dataObj: '=kableRenderer',
    },
    link: function ($scope, $elem, attrs) {

      var panelScope = $rootScope.$new();

      function render (renderFn, dataObj) {
        $elem.append('<div>')

        panelScope = $rootScope.$new();
        var panelElem = $('div', $elem)
        var panelDataObj = angular.copy(dataObj);

        Private(renderFn)(panelScope, panelElem, panelDataObj);
      }

      $scope.$watch('dataObj', function (dataObj) {
        panelScope.$destroy();
        $elem.empty();

        if (!dataObj) return;


        if (!_.has(dataObj, '_panel.type') && !attrs.type) {
          $elem.text('Some day I will be able to give you options...some day')
          return;
        }

        var panel = panels[attrs.type || dataObj._panel.type];
        if (!panel) {
          $elem.text('Unknown panel type. Darn.');
          return;
        }

        render(panel.render, dataObj);

      });
    }
  };
});