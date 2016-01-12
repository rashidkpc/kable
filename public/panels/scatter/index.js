var Panel = require('../panel');

var _ = require('lodash');
var $ = require('jquery');

require('flot_impact');
require('flotTime_impact');

module.exports = new Panel('scatter', {
  help: 'Draw a scatter plot',
  render: function scatterPanel() {
    return function ($scope, $elem, dataObj) {
      console.log('loaded chart');
      var defaultOptions = {
        xaxis: {
          mode: 'time',
          timezone: 'browser',
          tickLength: 0,
          color: '#ee0',
          font: { size: 13, color: '#666' }
        },
        grid: {
          backgroundColor: '#fff',
          borderWidth: 0,
          borderColor: null,
          margin: 10,
        },
        legend: {position: 'nw'},
        colors: ['#8c8'],
      };

      function drawPlot() {
        $elem.height($scope.height || 250);

        $scope.plot = $.plot($elem, [{label: dataObj.data.header[1], data: dataObj.data.rows}], defaultOptions);
      }

      $(window).resize(function () {
        drawPlot();
      });

      $scope.$on('$destroy', function () {
        $(window).off('resize'); //remove the handler added earlier
      });

      drawPlot();



    }
  }
});