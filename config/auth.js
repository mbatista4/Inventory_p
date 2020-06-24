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
            req.flash('success_msg', 'You can View This Page')
            res.redirect('/users/dashboard');
        } else {
            return next();
        }
    }
}