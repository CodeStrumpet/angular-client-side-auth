var express =       require('express')
    , fs =          require('fs')
    , http =        require('http')
    , passport =    require('passport')
    , path =        require('path')
    , config =      require('./config/config')
    , mongoose =    require('mongoose');

// Bootstrap db connection
var db = mongoose.connect(config.db);

//Bootstrap models
var models_path = __dirname + '/server/models';
var walk = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js$|coffee$)/.test(file)) {
                require(newPath);
            }
        } else if (stat.isDirectory()) {
            walk(newPath);
        }
    });
};
walk(models_path);

//bootstrap passport config
require('./config/passport')(passport);

var app = module.exports = express();

app.set('views', __dirname + '/client/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'))
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'client')));
app.use(express.cookieParser());
app.use(express.cookieSession(
    {
        secret: process.env.COOKIE_SECRET || "Superdupersecret"
    }));

app.configure('development', 'production', function() {
    app.use(express.csrf());
    app.use(function(req, res, next) {
        res.cookie('XSRF-TOKEN', req.csrfToken());
        next();
    });
});

app.use(passport.initialize());
app.use(passport.session());

//passport.use(User.localStrategy);
//passport.use(User.twitterStrategy());  // Comment out this line if you don't want to enable login via Twitter
//passport.use(User.facebookStrategy()); // Comment out this line if you don't want to enable login via Facebook
//passport.use(User.googleStrategy());   // Comment out this line if you don't want to enable login via Google
//passport.use(User.linkedInStrategy()); // Comment out this line if you don't want to enable login via LinkedIn

//passport.serializeUser(User.serializeUser);
//passport.deserializeUser(User.deserializeUser);

require('./server/routes.js')(app);

app.set('port', process.env.PORT || 8000);
http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});