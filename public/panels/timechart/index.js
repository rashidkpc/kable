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
      type: 'columns',
      required: true,
      help: 'The columns whose values you wish to plot'
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
        colors: [
          '#6eadc1',
          '#57c17b',
          '#6f87d8',
          '#663db8',
          '#bc52bc',
          '#9e3533',
          '#daa05d'
        ],
      };

      function drawPlot() {
        if (!config.xaxis || !config.yaxis || !dataTable) {
          $elem.text('Hey schmo, I need both xaxis and yaxis. I also need some damn data. Make it happen');
          return;
        }

        var rows = dataTable.data.rows;
        var columns = dataTable.data.header;

        var grouped;
        if (config.color && config.color.length) {
          grouped = _.groupBy(rows, function (row) {
            return _.chain(config.color)
            .map(function (color) {return columns.indexOf(color);})
            .map(function (index) {return row[index];})
            .values().join('::')
          });
        } else {
          grouped = {
            _all: rows
          };
        }

        var data = _.flatten(_.map(grouped, function (rows, label) {
          return _.map(config.yaxis, function (column) {
            var timestamps = getColumn(config.xaxis, rows, columns);
            var values = getColumn(column, rows, columns);

            return {
              label: `${label}::${column}`,
              data: _.zip(timestamps, values),
              shadowSize: 0
            };
          })
        }));

        $elem.height($elem.parent().parent().height());
        $scope.plot = $.plot($elem, data, defaultOptions);
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
