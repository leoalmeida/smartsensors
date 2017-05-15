//var routes = require('../routes/index');
//var apis = require('../routes/apis');
//var user = require('../routes/user');
//var file = require('../routes/file');
//var view = require('../routes/view');
var load = require('express-load');

module.exports = function (app,passport){
      load("routes", {cwd: 'server/app', verbose:true})
        .into(app);

      //configure public folders
      //app.use('/', express.static(path.resolve('wwwroot', '../web/src')));
      app.use('/', app.routes.index);
      app.use('/profile', app.routes.profile);
      //app.use('/graph', app.routes.graph);
      //app.use('/retrieve', app.routes.retrieve);
      app.use('/context', app.routes.context);
      app.use('/reference', app.routes.reference);
      app.use('/object', app.routes.object);
      app.use('/association', app.routes.association);
      app.use('/knowledge', app.routes.knowledge);
      //app.use('/trigger', app.routes.trigger);
      //app.use('/remove', app.routes.remove);

}
