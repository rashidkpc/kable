var moment = require('moment');
require('plugins/kable/less/main.less');
require('plugins/kable/components/kable_renderer/kable_renderer');
require('plugins/kable/directives/textarea_input');
require('plugins/kable/directives/panel_config');

require('ui/autoload/all');

var timelionLogo = require('plugins/kable/kable.svg');

require('ui/chrome')
.setBrand({
  'logo': 'url(' + timelionLogo + ') left no-repeat #444',
  'smallLogo': 'url(' + timelionLogo + ') left no-repeat #444'
}).setTabs([]);

var app = require('ui/modules').get('app/kable', []);

var unsafeNotifications = require('ui/notify')._notifs;
var panelTypes = require('plugins/kable/panels/load');

require('ui/routes').enable();
require('ui/routes')
  .when('/', {
    template: require('plugins/kable/templates/index.html')
  });

  /*
  {
    expression: '.index(_all)'
    config: {
      type: 'line',
      x: '@timestamp',
      y: 'count',
      fill: 'top_user_count'
      dotSize: 'user_cardinality'
    }
  }
  */

app.controller('kableHelloWorld', function ($scope, $http, AppState, Notifier, timefilter) {
  timefilter.enabled = true;
  $scope.timefilter = timefilter;

  var notify = new Notifier({location: 'Kable'});

  $scope.panelTypes = panelTypes;
  $scope.state = new AppState({expression: ''});
  $scope.tab = 'vis';

  $scope.topNavMenu = [];

  function init() {
    $scope.run();
  }

  var defaultPanel = {
    expression: '.index(_all)',
    config: {
      type: 'table',
      editing: false,
    }
  }

  $scope.dataTables = [];
  $scope.state = new AppState({panels: [defaultPanel]});

  $scope.addPanel = function () {
    $scope.state.panels.push(defaultPanel);
    $scope.run();
  }

  $scope.removePanel = function (index) {
    $scope.state.panels.splice(index, 1);
    $scope.dataTables.splice(index, 1);
  }

  $scope.run = function () {
    $scope.state.save();
    var timefilterBounds = $scope.timefilter.getBounds();
    $scope.dataTables = _.map($scope.state.panels, function (panel) {
      return $http.post('../api/kable/run', {
        expression: panel.expression,
        time: {
          from: timefilterBounds.min.valueOf(),
          to: timefilterBounds.max.valueOf()
        }
      }).then(function (resp) {
        return resp.data;
        dismissNotifications();
      }).catch(function (err) {
        console.log(err);
        notify.error(err);
        return {};
      });
    })
  }

  $scope.$listen(timefilter, 'fetch', $scope.run);

  function dismissNotifications() {
    unsafeNotifications.splice(0, unsafeNotifications.length);
  }

  init();
});
