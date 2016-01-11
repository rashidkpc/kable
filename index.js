module.exports = function (kibana) {
  return new kibana.Plugin({

    name: 'kable',
    require: ['kibana', 'elasticsearch'],
    uiExports: {
      app: {
        title: 'Kable',
        description: 'Weeeeee',
        main: 'plugins/kable/app'
      }
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

