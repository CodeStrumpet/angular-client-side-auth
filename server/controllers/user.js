var _ =           require('underscore')
    , mongoose  = require('mongoose')
    , User      = mongoose.model('User')
    , userRoles = require('../../client/js/routingConfig').userRoles;

module.exports = {
    index: function(req, res) {
        var users = User.find({}, function(err, users) {
            _.each(users, function(user) {
                delete user.password;
                delete user.twitter;
                delete user.facebook;
                delete user.google;
                delete user.linkedin;
            });
            res.json(users);            
        });
    }
};