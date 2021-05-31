const proxy = require('http-proxy-middleware');
module.exports = function (app) {
  app.use(proxy('/getPolls', { target: 'http://localhost:5000' }));
  app.use(proxy('/changePass', { target: 'http://localhost:5000' }));
  app.use(proxy('/sendFeedback', { target: 'http://localhost:5000' }));
  app.use(proxy('/resetPassword', { target: 'http://localhost:5000' }));
};
