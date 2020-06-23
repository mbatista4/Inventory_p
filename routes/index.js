const express = require('express');
const router = express.Router();
const {
    ensureAuthenticated,
    ensureUnAuthenticated
} = require('../config/auth');

// Welcome Page
router.get('/', ensureUnAuthenticated, (req, res) => {
    res.render('homepage');
});

//Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard', {
        name: req.user.name
    });
});


// Delete User 
router.get('/delete', async (req, res) => {
    console.log('here')
    try {
        await req.user.remove();
        req.logOut();
        req.flash('success_msg', 'You deleted your account!');
        res.redirect('/');
    } catch (error) {

    }
});

module.exports = router;