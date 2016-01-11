var runner = require('../lib/runner');

module.exports = function (server) {
  server.route({
    path: '/kable/api/run',
    method: 'POST',
    handler: function (req, reply) {
      console.log(req.payload);
      var resp;
      try {
        resp = runner(req.payload.expression)
        reply(resp);
      } catch (e) {
        resp = e.toString();
        reply(resp).code(400);
      }
    }
  });
};
