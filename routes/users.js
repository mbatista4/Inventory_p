const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const {
    ensureUnAuthenticated,
    ensureAuthenticated
} = require('../config/auth');


// models
const User = require('../models/User');
const Item = require('../models/item');

//all User Names 
router.get('/', async (req, res) => {

    let searchOptions = {};

    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i');
    }

    try {
        const users = await User.find(searchOptions);
        res.render('users/index', {
            users: users,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/users');
    }
});

// Login
router.get('/login', ensureUnAuthenticated, (req, res) => {
    res.render('users/login');
});

// Login handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/users/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
})

//Dashboard
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
    try {
        const items = await Item.find({
            user: req.user._id
        });
        console.log(items);
        res.render('users/dashboard', {
            user: req.user,
            items: items
        });

    } catch (err) {
        console.error('err');
    }

});

// Register
router.get('/register', ensureUnAuthenticated, (req, res) => {
    res.render('users/register');
});

// Register Handle
router.post('/register', (req, res) => {
    const {
        name,
        email,
        password,
        password2
    } = req.body;

    let errors = [];

    // Check required field
    if (!name || !email || !password || !password2) {
        errors.push({
            msg: 'Please fill in all fields'
        })
    }

    // Check passwords match
    if (password !== password2) {
        errors.push({
            msg: 'Passwords do not match'
        })
    }

    // Check passwords length
    if (password.length < 6) {
        errors.push({
            msg: 'Password is too short, should be at least 6 characters'
        })
    }

    // Check passwords match
    if (errors.length > 0) {
        res.render('users/register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        //Validation Passed
        User.findOne({
            email: email
        }).then(user => {
            if (user) {
                //User exists
                errors.push({
                    msg: 'Email is already registered'
                });
                res.render('users/register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                });

                //Hash Password
                bcrypt.genSalt(10, (err, salt) =>
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        // Set password to hashed
                        newUser.password = hash;
                        //Saving user
                        newUser.save().then(user => {
                            req.flash('success_msg', 'You are now Registered and can Login!')
                            res.redirect('/users/login');
                        }).catch(err => console.log(err));
                    }));
            }
        });
    }
});

// Logout Handle
router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success_msg', 'You have Logged out!');
    res.redirect('/');
})


//Get One User Route
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const items = await Item.find({
            user: user.id
        });

        res.render('users/show', {
            user: user,
            itemsByUser: items,
        });
    } catch (err) {
        console.error(err);
    }
});


// Delete User 
router.delete('/delete', async (req, res) => {
    try {
        await req.user.remove();
        req.logOut();
        req.flash('success_msg', 'You deleted your account!');
        res.redirect('/');
    } catch (err) {
        req.logOut();
        req.flash('error_msg', 'Error Deleting account');
        res.redirect('/');
        console.log(err);
    }
});

module.exports = router;