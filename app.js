var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const swig = require('swig');
require('body-parser-xml')(bodyParser);
const index = require('./routes/index');

var app = express();

/**
 * 跨域设置
 */

const ALLOW_ORIGIN = [ // 域名白名单
    'm.shanbei-course.com',
    'localhost',
    'm.shanbei-sat.com',
    'xin.shiershi.hsk.la',
    'xin.shiyiyiba.hsk.la',
    'xin.shiyue.hsk.la',
    'rzzc.ltd',
];

app.all('*', function (req, res, next) {
    let reqOrigin = req.headers.origin; // request响应头的origin属性
    if(reqOrigin){
        for(let i = 0; i < ALLOW_ORIGIN.length; i++) {
            let _str = '';
            if(ALLOW_ORIGIN[i] == 'localhost'){
                _str = 'localhost';
            }else{
                _str = ALLOW_ORIGIN[i];
            }
            if(reqOrigin.indexOf(_str) >= 0){
                res.header("Access-Control-Allow-Origin", reqOrigin);
            }
        }
    }else{
        res.header("Access-Control-Allow-Origin", '*');
    }

    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    if (req.method == "OPTIONS")
        res.send(200); /*让options请求快速返回*/
    else next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.engine('html', swig.renderFile);


//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.xml({
    limit: "1MB", // Reject payload bigger than 1 MB
    xmlParseOptions: {
        normalize: true, // Trim whitespace inside text nodes
        normalizeTags: true, // Transform tags to lowercase
        explicitArray: false // Only put nodes in array if >1
    },
    verify: function (req, res, buf, encoding) {
        console.log(req);
        if (buf && buf.length) {
            // Store the raw XML
            req.rawBody = buf.toString(encoding || "utf8");
        }
    }
}));

/**
 * 登录过滤器
 */
/*app.use((req, res, next) => {
    var url = req.originalUrl;
    if (url.indexOf('expose') <= -1 && url != "/index" && url.indexOf('wechat') <= -1 && req.session.loginUser == undefined) {
        if(url.indexOf('share') <= -1 )
            res.json({
                status: 0,
                code: -1,
                msg: '非法请求'
            });
        res.end();
    } else {
        next();
    }
});*/

app.use(cookieParser('dianhai'));
app.use(session({
    name: "identityKey",
    secret: 'dianhai', // 用来对session id相关的cookie进行签名
    saveUninitialized: false, // 是否自动保存未初始化的会话，建议false
    resave: false, // 是否每次都重新保存会话，建议false
    rolling: true,
    cookie: {
        maxAge: 3600000 // 有效期，单位是毫秒
    }
}));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static('public'));
/**
 * 微信请求过滤器
 */
// app.use('/wechat', wechatFilter.checkSignature());

app.use('/', index);
const account = require('./routes/account');
app.use('/admin', account);
const role = require('./routes/role');
app.use('/role', role);
const wechat = require('./routes/wechat');
app.use('/wechat', wechat);
const wx = require('./routes/wx');
app.use('/wx', wx);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;