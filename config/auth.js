module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        req.flash('error_msg', 'Please log in to view this page');
        res.redirect('/users/login');
    },
    ensureUnAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect('/dashboard');
        } else {
            return next();
        }
    }
}