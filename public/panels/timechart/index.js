var Panel = require('plugins/kable/panels/panel');
var getColumn = require('plugins/kable/lib/get_column');

var _ = require('lodash');
var $ = require('jquery');

require('flot_kable');
require('flotTime_kable');

module.exports = new Panel('timechart', {
  help: 'Draw a timeseries chart',
  args: [
    {
      name: 'xaxis',
      type: 'column',
      required: true,
      help: 'The column containing your timestamps in millis-since-epoch format'
    },
    {
      name: 'yaxis',
      type: 'column',
      required: true,
      help: 'The column with the values to plot'
    },
    {
      name: 'color',
      type: 'columns',
      help: 'A column to group on to create distinct series. Each unique value in this column will be given its own color.'
    }
  ],
  render: function timechartPanel() {
    return function ($scope, $elem, dataTable, config) {
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
        if (!config.xaxis || !config.yaxis || !dataTable) {
          $elem.text('Hey schmo, I need both xaxis and yaxis. I also need some damn data. Make it happen');
          return;
        }

        var timestamps = getColumn(dataTable, config.xaxis);
        var values = getColumn(dataTable, config.yaxis);
        var data = _.zip(timestamps, values);

        $elem.height($elem.parent().parent().height());
        $scope.plot = $.plot($elem, [{label: config.yaxis, data: data}], defaultOptions);
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
