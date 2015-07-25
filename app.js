var log4s=require('log4js')
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');//要使用session,需要单独包含这个模块
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var settings = require('./Settings');

var routes = require('./routes/index');


var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());    //cookie解析的中间件
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: settings.cookieSecret,
    store: new MongoStore({
        db: settings.db
    })

}));


var log4js = require('log4js');
log4js.configure({
    appenders: [
        { type: 'console' }, //控制台输出
        {
            type: 'file', //文件输出
            filename: 'logs/access.log',
            maxLogSize: 1024,
            backups:3,
            category: 'normal'
        }
    ]
});
var logger = log4js.getLogger('normal');
logger.setLevel('INFO');

//app.use(...)
//app.use(...)
app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO}));
//var log4js=require('./logjsutil.js').log4js;
//var logger = require('./logjsutil.js').logger();
//app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO}));


app.use(function(req,res,next){
    //res.res.locals.user=req.req.session.user;
    res.locals.user=req.session.user;
    var err=req.flash('error');
    var success=req.flash('success');
    res.locals.error=err.length?err:null;
    res.locals.success=success.length?success:null;

    next();
});

app.use('/', routes);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    var meta='['+new Date()+']'+req.url+'\n';
    errorLogfile.write(meta+err.stack+'\n');
    next();
});




module.exports = app;
