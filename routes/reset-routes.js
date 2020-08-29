const path = require('path');
require('dotenv').config({path: __dirname + '../.env'})

const router = require('express').Router();
const User = require('../models/user-model');
const sendMail = require('../mail/mail');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// get auth/resetusername
router.get('/resetusername/:email', (req, res, next) => {
    User.findOne({ email: req.params.email }).exec()
    .then(user => {
        if (!req.params.email) {
            return res.send({ success: false, message: 'No email was provided' });
        } else if (!user) {
            return res.send({ success: false, message: 'Email was not found' });
        } else if (!user.isActive) {
            return res.send({ success: false, message: 'User is not yet activated. Please click the activation link sent in your email' });
        } else {
            // send forgot username e-mail
            const subject = 'Localhost Username Request';
            const html = 'Hello<b> ' + user.name + '</b><br><br>You recently requested your username. Please save the username in your files: ' + user.username;
            const text = 'Hello ' + user.name + ', you recently requested your username. Please save the username in your files: ' + user.username;

            sendMail(user.email, subject, html, text, function(err, data) {
                
                if (err) {
                    return res.json({ success: false, message: 'Internal Error' });
                } else {
                    console.log('Email sent');
                }
            });

            return res.send({ success: true, message: 'Username has been sent to your email' });
        }
    })
    .catch(err => {
        console.log(err);
        return res.send({ success: false, message: err });
    });
});


// put auth/resetpassword
router.put('/resetpassword', (req, res, next) => {
    User.findOne({ email: req.body.email }).exec()
    .then(user => {
        if (!user) {
            return res.send({ success: false, message: 'Email was not found' });
        } else if (!user.isActive) {
            return res.send({ success: false, message: 'User has not yet been activated. Please click the activation link sent in your email' });
        } else {
            user.resettoken = jwt.sign({ name: user.name, email: user.email }, process.env.JWT_KEY, { expiresIn: "1h" });

            user.save()
            .then(result => {
    
                // send password reset e-mail
                const subject = 'Localhost Reset Password Request';
                const html = 'Hello<b> ' + result.name + '</b><br><br>You recently requested a password reset link. Please click on the link below to reset your password: <br><br><a href="http://localhost:4200/reset/' + result.resettoken + '">http://localhost:4200/reset/</a>';
                const text = 'Hello ' + result.name + ', you recently requested a password reset link. Please click on the following link to reset your password: http://localhost:4200/reset/' + result.resettoken;
                        
                sendMail(result.email, subject, html, text, function(err, data) {
                    
                    if (err) {
                        return res.json({ success: false, message: 'Internal Error' });
                    } else {
                        console.log('Email sent');
                    }
                });

                return res.status(201).send({ success: true, message: 'Please check your email for password reset link' });
        })
        .catch(err => {
            console.log(err);
            return res.send({ success: false, message: err });
        }); 
    }
    })
    .catch(err => {
        console.log(err);
        return res.send({ success: false, message: err });
    });
});

// get auth/resetpassword
router.get('/resetpassword/:token', (req, res, next) => {
    User.findOne({ resettoken: req.params.token}).exec()
    .then(user => {
        const token = req.params.token;
        // function to verify token
        jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
            if (err) {
                return res.send({ success: false, message: 'Password link has expired' });
            } else if (!user) {
                return res.send({ success: false, message: 'Password link has expired' });
            } else if (decoded) {
                return res.send({ success: true, message: 'Profile verified', user: user });
            }
        });
    })
    .catch(err => {
        console.log(err);
        return res.send({ success: false, message: err });
    });
});

// put auth/savenewpassword
router.put('/savenewpassword', (req, res, next) => {
    User.findOne({ email: req.body.email }).exec()
    .then(user => {
        if (req.body.password == null || req.body.password == '') {
            return res.send({ success: false, message: 'Password not provided' });
        } else {
            // regex check for password
            let regex = /^(?=.*[-@_])[\w@-]{6,20}$/;
            if (regex.test(req.body.password)) {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err)  {
                        return res.send({ success: false, message: err });
                    } else {
                        user.password = hash;
                        user.resettoken = false;
                        user.save()
                        .then(result => {
                            if (result) {
                                // send password reset done confirmation e-mail
                                const subject = 'Localhost Reset Password Confirmation';
                                const html = 'Hello<b> ' + result.name + '</b><br><br>This e-mail is to notify you that your password was recently reset at localhost.com';
                                const text = 'Hello ' + result.name + ', This e-mail is to notify you that your password was recently reset at localhost.com';
                                        
                                sendMail(result.email, subject, html, text, function(err, data) {
                                    
                                    if (err) {
                                        return res.json({ success: false, message: 'Internal Error' });
                                    } else {
                                        console.log('Email sent');
                                    }
                                });

                                return res.send({ success: true, message: 'Password has been reset!' });
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            return res.send({ success: false, message: err });
                        });
                    }
                });
            } else {
                return res.json({ "success": false, "message": "Entered password value is not a valid password! Password must be alphanumeric, must have atleat one special character (@, _ and - are allowed) and must be 6 - 20 characters" });
            }
        }
    })
    .catch(err => {
        console.log(err);
        return res.send({ success: false, message: err });
    });
});


module.exports = router;