var express = require('express')
    , session = require('express-session')
    , cookieParser = require('cookie-parser')
    , cookieSession = require('cookie-session')
    , bodyParser = require('body-parser')
    , mongoStore = require('connect-mongo')(session)
    , flash = require('connect-flash')
    , csrf = require('csurf')
    , multer = require('multer')
    //, load = require('express-load')
    //var config = require('config')
//    , auth = require('../middlewares/auth')
    , pkg = require('../../package.json');


var env = process.env.NODE_ENV || 'development';



module.exports = function (app){
  //load("middlewares", {cwd: 'server/app', verbose:true})
  //  .into(app);

// view engine setup
//app.set('views', path.join(__dirname, 'app/views'));
//app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

// configure Middlewares
app.use(require('../middlewares/i18n'));
app.use(require('../middlewares/auth'));

// Config Error Handdler
app.use(require('../middlewares/error'));
app.use(require('../middlewares/deverror'));
app.use(require('../middlewares/notfound'));

// catch 404 and forward to error handler
//app.use(app.middlewares.notfound);
/*app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});*/

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    //app.use(app.middlewares.deverror);
    /*app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });*/
}

// production error handler
// no stacktraces leaked to user
//app.use(app.middlewares.error);
/*app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});*/
};
