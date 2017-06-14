var load = require('express-load');

module.exports = function (app){
      load("routes", {cwd: 'server/app', verbose:true})
        .into(app);

      app.use('/', app.routes.action);

}
