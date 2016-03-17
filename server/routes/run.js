var runner = require('../lib/runner');

module.exports = function (server) {
  server.route({
    path: '/api/kable/run',
    method: 'POST',
    handler: function (req, reply) {
      var resp;
      try {
        resp = runner(req.payload.expression)
      } catch (e) {
        console.log(e);
        resp = e.toString();
        //reply(resp).code(400);
      }

      Promise.resolve(resp).then(function (resp) {
        reply(resp);
      }).catch(function (resp) {
        reply(resp);
      });

    }
  });
};
