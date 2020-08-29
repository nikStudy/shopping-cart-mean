const path = require('path');
require('dotenv').config({path: __dirname + '../.env'})

const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const sendMail = require('../mail/mail');
const User = require('../models/user-model');

// // auth login
// router.get('/login', (req, res) => {
//     res.render('login', { user: req.user});
// });

// auth logout
router.get('/logout', (req, res) => {
    // handle with pasport
    // res.send('logging out');
    req.logout();
    req.session = null; // to destroy a session using cookie-session
    // res.redirect('/');
});

// auth with google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google', 
    { failureRedirect: 'http://localhost:4200/login' }), (req, res) => {
    // res.send(req.user);
    if (req.user.isActive) {
        const token = jwt.sign({
            name: req.user.name,
            email: req.user.email,
            _id: req.user._id
        },
        process.env.JWT_KEY,
        {
            expiresIn: "1h"
        });
        res.redirect('http://localhost:4200/social/' + token);
    } else {
        // console.log(req.user);
        // user = {
        //     // _id: req.user._id,
        //     name: req.user.name,
        //     email: req.user.email,
        //     password: req.user.password,
        //     googleId: req.user.googleId,
        //     githubId: req.user.githubId,
        //     isActive: req.user.isActive
        // };
            
        req.user.temporarytoken = jwt.sign({ name: req.user.name, email: req.user.email }, process.env.JWT_KEY, { expiresIn: "1h" });
        // console.log(user);
        new User(req.user).save()
        .then(result => {
            console.log('Section 1');
            // send activation link e-mail
            const subject = 'Localhost Activation Link Request';
            const html = 'Hello<b> ' + result.name + '</b><br><br>You recently requested a new account activation link. Please click on the link below to complete your activation: <br><br><a href="http://localhost:4200/activate/' + result.temporarytoken + '">http://localhost:4200/activate/</a>';
            const text = 'Hello ' + result.name + ', you recently requested a new account activation link. Please click on the following link to complete your activation: http://localhost:4200/activate/' + result.temporarytoken;
                    
            sendMail(result.email, subject, html, text, function(err, data) {
                
                if (err) {
                    return res.json({ success: false, message: 'Internal Error' });
                } else {
                    console.log('Email sent');
                }
            });

            // res.status(201).send({
            //     success: true,
            //     message: 'Activation link has been sent to ' + result.email + '!'
            // });
        })
        .catch(err => {
            console.log(err);
            return res.send({ success: false, error: err });
        });
        res.redirect('http://localhost:4200/social-error/');
    }
    
});

module.exports = router;