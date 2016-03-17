var moment = require('moment');
require('plugins/kable/less/main.less');
require('plugins/kable/components/kable_renderer/kable_renderer');
require('plugins/kable/directives/textarea_input');
require('ui/autoload/all');

var timelionLogo = require('plugins/kable/header.png');

require('ui/chrome')
.setBrand({
  'logo': 'url(' + timelionLogo + ') left no-repeat',
  'smallLogo': 'url(' + timelionLogo + ') left no-repeat'
}).setTabs([]);

var app = require('ui/modules').get('app/kable', []);

var unsafeNotifications = require('ui/notify')._notifs;

require('ui/routes').enable();
require('ui/routes')
  .when('/', {
    template: require('plugins/kable/templates/index.html')
  });


app.controller('kableHelloWorld', function ($scope, $http, AppState, Notifier) {
  var notify = new Notifier({ocation: 'Kable'});
  $scope.state = new AppState({expression: ''});
  $scope.tab = 'vis';

  function init() {
    $scope.run();
  }

  $scope.run = function () {
    $scope.state.save();
    $http.post('../api/kable/run', {
      expression: $scope.state.expression
    }).then(function (resp) {
      $scope.dataTables = resp.data;
      dismissNotifications();
    }).catch(function (err) {
      console.log(err);
      $scope.dataTables = null;
      notify.error(err);
    });
  }

  function dismissNotifications() {
    unsafeNotifications.splice(0, unsafeNotifications.length);
  }

  init();
});
