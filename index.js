var path = require('path');

module.exports = function (kibana) {
  return new kibana.Plugin({

    name: 'kable',
    require: ['kibana', 'elasticsearch'],
    uiExports: {
      app: {
        title: 'Kable',
        description: 'Weeeeee',
        icon: 'plugins/kable/icon.svg',
        main: 'plugins/kable/app',
        injectVars: function (server, options) {
          var config = server.config();
          return {
            kbnIndex: config.get('kibana.index'),
            esShardTimeout: config.get('elasticsearch.shardTimeout'),
            esApiVersion: config.get('elasticsearch.apiVersion')
          };
        }
      },
      modules: {
        flot_kable$: {
          path: path.resolve(__dirname, 'bower_components/flot/jquery.flot'),
          imports: 'jquery'
        },
        flotTime_kable$: {
          path: path.resolve(__dirname, 'bower_components/flot/jquery.flot.time'),
          imports: 'flot_kable'
        },
        flotPie_kable$: {
          path: path.resolve(__dirname, 'bower_components/flot/jquery.flot.pie'),
          imports: 'flot_kable'
        }
      },
    },

    config: function (Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },

    init: function (server, options) {
      // Add server routes and initalize the plugin here
      require('./server/routes/run')(server);
    }

  });
};
