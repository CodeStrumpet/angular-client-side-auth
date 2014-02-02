var passport =  require('passport')
    , mongoose =    require('mongoose')
    , User = mongoose.model('User');

module.exports = {
    register: function(req, res, next) {
        var user = new User(req.body);

        var message = null;

        user.provider = 'local';
        user.save(function(err) {
            if (err) {
                switch (err.code) {
                    case 11000:
                    case 11001:
                        message = 'Username already exists';
                        break;
                    default:
                        message = 'Please fill all the required fields';
                }

                return res.render('users/signup', {
                    message: message,
                    user: user
                });
            }
            req.logIn(user, function(err) {
                if (err) return next(err);
                else        { res.json(200, { "role": user.role, "username": user.username }); }
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
        passport.authenticate('local', function(err, user) {

            if(err)     { return next(err); }
            if(!user)   { return res.send(400); }


            req.logIn(user, function(err) {
                if(err) {
                    return next(err);
                }

                if(req.body.rememberme) req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
                var userResp = { "role": user.role, "username": user.username };
                res.json(200, userResp);
            });
        })(req, res, next);
    },

    logout: function(req, res) {
        req.logout();
        res.send(200);
    }
};