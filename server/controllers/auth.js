var passport =  require('passport')
    , mongoose =    require('mongoose')
    , User = mongoose.model('User');

module.exports = {
    register: function(req, res, next) {
        var user = new User(req.body);

        var message = null;

        user.provider = 'local';
        user.save(function(err) {
            console.log('user in register: ' + JSON.stringify(user));
            if (err) {
                console.log('err: ' + err);
                switch (err.code) {
                    case 11000:
                    case 11001:
                        message = 'Username already exists';
                        break;
                    default:
                        message = 'Please fill all the required fields';
                }

                return res.json({
                    message: message,
                    user: user
                });
            }
            req.logIn(user, function(err) {
                if (err) return next(err);
                else        { res.json(200, { "role": user.role, "email": user.email }); }
                //return res.redirect('/');
            });
        });

        /*
        try {
            User.validate(req.body);
        }
        catch(err) {
            return res.send(400, err.message);
        }

        User.addUser(req.body.username, req.body.password, req.body.role, function(err, user) {
            if(err === 'UserAlreadyExists') return res.send(403, "User already exists");
            else if(err)                    return res.send(500);

            req.logIn(user, function(err) {
                if(err)     { next(err); }
                else        { res.json(200, { "role": user.role, "username": user.username }); }
            });
        });
        */
    },

    login: function(req, res, next) {
        console.log('req body: ' + JSON.stringify(req.body));
        req.body.username = req.body.email;
        passport.authenticate('local', function(err, user, info) {

            console.log('user back from passport: ' + JSON.stringify(info));

            if(err)     { return next(err); }
            if(!user)   { return res.send(400); }


            req.logIn(user, function(err) {
                if(err) {
                    return next(err);
                }

                if(req.body.rememberme) req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
                var userResp = { "role": user.role, "email": user.email };
                res.json(200, userResp);
            });
        })(req, res, next);
    },

    logout: function(req, res) {
        req.logout();
        res.send(200);
    }
};