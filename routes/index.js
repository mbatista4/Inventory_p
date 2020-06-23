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