var passport = require('passport');

module.exports = {
    IsAuthenticated: function (req,res,next){
        if(req.isAuthenticated()){
            next();
        }else{
            req.flash('warning', 'Please login.');
            res.redirect('/login');
        }
    },

    // api uses a custom callback method
    IsApiAuthenticated: function(req, res, next) {
        passport.authenticate('local-api', function(err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                next(new Error(401));
            }
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                next();
            });
        })(req, res, next);
    }
};