var load = require('express-load');

module.exports = function (app){
      load("routes", {cwd: 'server/app', verbose:true})
        .into(app);

      //configure public folders
      //app.use('/', express.static(path.resolve('wwwroot', '../web/src')));
      app.use('/', app.routes.index);
      app.use('/api/profile', app.routes.profile);
      app.use('/api/action', app.routes.action);
      app.use('/api/reference', app.routes.reference);
      app.use('/api/association', app.routes.association);
      app.use('/knowledge', app.routes.knowledge);


      //app.use('/object', app.routes.object);
      //app.use('/graph', app.routes.graph);
      //app.use('/retrieve', app.routes.retrieve);
      //app.use('/context', app.routes.context);\
      //app.use('/trigger', app.routes.trigger);
      //app.use('/remove', app.routes.remove);

}
