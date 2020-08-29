const path = require('path');
require('dotenv').config({path: __dirname + '../.env'})

const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user-model');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');
const sendMail = require('../mail/mail');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const bodyParser = require('body-parser');
const cors = require('cors');

router.use(cors());

// Route middlewares
let csrfProtection = csrf({ cookie: true });
// let csrfProtection = csrf();
let parseForm = bodyParser.urlencoded({ extended: false });
// let csrfProtection = csrf();

// Parse cookies
// We need this because "cookie" is true in csrfProtection
router.use(cookieParser());
// router.use(csrf({
//     cookie: {
//         key: '_csrf',
//         path: '/',
//         httpOnly: false,
//         secure: false,
//         signed: false,
//         maxAge: 24 * 60 * 60 * 1000
//     }
// }));
router.use(csrfProtection);

// create home route
router.get('/', csrfProtection, (req, res) => {
    // Pass the Csrf Token
    res.cookie('XSRF-TOKEN', req.csrfToken(), { httpOnly: false });
    res.json({});
    // return res.send({ csrfToken: req.csrfToken() });
});

// auth register
router.get('/register', (req, res) => {
    res.render('register', { user: req.user});
});

// auth register
router.post('/register', (req, res) => {

    User.find({email: req.body.email}).exec()
        .then(user => {
            if (user.length >= 1) {
                // return res.status(409).send({
                //     success: false,
                //     message: 'Email exists'
                // });
                return res.send({
                    success: false,
                    message: 'Email exists'
                });
                // res.redirect('/auth/register');
            } else {
              // regex check for password
              let regex = /^(?=.*[-@_])[\w@-]{6,20}$/;
              if (regex.test(req.body.password)) {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        // return res.status(500).status.json({
                        //     "success": false,
                        //     "error": err
                        // })
                        return res.json({
                            "success": false,
                            "error": err
                        })
                    } else {
                            user = new User({
                            name: req.body.name,
                            username: req.body.username,
                            email: req.body.email,
                            password: hash,
                            temporarytoken: jwt.sign({ name: req.body.name, email: req.body.email }, process.env.JWT_KEY, { expiresIn: "1h" })
                            });
                            
                        user
                        .save()
                        .then(result => {
                            console.log(result);

                            // send activation link e-mail
                            const subject = 'Localhost Activation Link';
                            const html = 'Hello<b> ' + result.name + '</b><br><br>Thank you for registering at localhost.com. Please click on the link below to complete your activation: <br><br><a href="http://localhost:4200/activate/' + result.temporarytoken + '">http://localhost:4200/activate/</a>';
                            const text = 'Hello ' + result.name + ', thank you for registering at localhost.com. Please click on the following link to complete your activation: http://localhost:4200/activate/' + result.temporarytoken;
                                    
                            sendMail(result.email, subject, html, text, function(err, data) {
                                
                                if (err) {
                                    res.json({ message: 'Internal Error' });
                                } else {
                                    res.json({ message: 'Email sent!!!' });
                                }
                            });

                            return res.status(201).send({
                                success: true,
                                // message: 'User created'
                                message: 'Account registered! Please check your e-mail for activation link.'
                            });
                            // res.redirect('/auth/login');
                        })
                        .catch(err => {
                            console.log(err);
                            // return res.status(500).json({
                            //     "success": false,
                            //     "error": err
                            // });
                            if (err.errors.name) {
                                return res.json({ "success": false, "message": err.errors.name.message });
                            } else if (err.errors.username) {
                                return res.json({ "success": false, "message": err.errors.username.message });
                            } else if (err.errors.email) {
                                return res.json({ "success": false, "message": err.errors.email.message });
                            } else  {
                                return res.json({ "success": false, "message": err });
                            }
                            // res.redirect('/auth/register');
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
            // return res.status(500).json({
            //     "success": false,
            //     "error": err
            // });
            return res.json({
                "success": false,
                "message": err
            });
            // res.redirect('/auth/register');
        });
});

// auth login
router.get('/login', (req, res) => {
    res.render('login', { user: req.user});
});

// auth login
router.post('/login', (req, res, next) => {
    User.findOne({email: req.body.email}).exec()
        .then(user => {
            if (!user) {
                // return res.status(401).send({
                //     success: false,
                //     message: 'Auth failed'
                // });
                return res.send({
                    success: false,
                    message: 'Auth failed'
                });
            }

            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err) {
                    // return res.status(401).send({
                    //     success: false,
                    //     message: 'Auth failed'
                    // });
                    return res.send({
                        success: false,
                        message: 'Auth failed'
                    });
                    // res.redirect('/auth/login');
                }
                if (result) {
                    if (!user.isActive) {
                        return res.send({
                            success: false,
                            message: 'Account is not yet activated. Please check your e-mail for activation link.',
                            expired: true
                        });
                    }

                    const token = jwt.sign({
                        name: user.name,
                        email: user.email,
                        _id: user._id
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    });

                    if (req.session.oldUrl === 'checkout') {
                        req.session.oldUrl = null;
                        return res.status(200).send({
                            success: true,
                            message: 'Auth successful... Redirecting to Checkout',
                            token: token
                        });
                    } else {
                        return res.status(200).send({
                            success: true,
                            message: 'Auth successful',
                            token: token
                        });
                    }
                    // return res.status(200).header('x-auth', token).send({
                    //     success: true,
                    //     message: 'Auth successful'
                    // });
                    // res.redirect('/profile/');
                }
                // res.status(401).send({
                //     success: false,
                //     message: 'Auth failed'
                // });
                return res.send({
                    success: false,
                    message: 'Auth failed'
                });
            });
        })
        .catch(err => {
            console.log(err);
            // res.status(500).send({
            //     success: false,
            //     error: err
            // });
            return res.send({
                success: false,
                error: err
            });
    });
});


// auth resend activation link
router.post('/resend', (req, res, next) => {
    User.findOne({ email: req.body.email}).exec()
    .then(user => {
        if(!user) {
            return res.json({ success: false, message: 'Could not authenticate user'});
        } else if (user) {
            if (!req.body.password) {
                return res.json({ success: false, message: 'No password provided'});
            } else {
                bcrypt.compare(req.body.password, user.password, (err, result) => {
                    if (err) {
                        return  res.json({ success: false, message: 'Could not authenticate password'});
                    }
                    if (!result) {
                        return  res.json({ success: false, message: 'Could not authenticate password'});
                    } else if (result) {
                        if (user.isActive) {
                            return  res.json({ success: false, message: 'Account is already active'});
                        } else {
                            return  res.json({ success: true, email: user.email});
                        }
                    }
                });
            }
        } 
    })
    .catch(err => {
        console.log(err);
        return res.send({ success: false, error: err });
    });
});

// auth resend activation link
router.put('/resend', (req, res, next) => {
    User.findOne({ email: req.body.email}).exec()
    .then(user => {
        console.log('Section 1');
        user.temporarytoken = jwt.sign({ name: user.name, email: user.email }, process.env.JWT_KEY, { expiresIn: "1h" });

        user.save()
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

            return res.status(201).send({
                success: true,
                message: 'Activation link has been sent to ' + user.email + '!'
            });
        })
        .catch(err => {
            console.log(err);
            return res.send({ success: false, error: err });
        });
    })
    .catch(err => {
        console.log(err);
        return res.send({ success: false, error: err });
    });
});

// auth delete
router.delete('/delete/:id', checkAuth, (req, res, next) => {
    User.findByIdAndRemove({_id: req.params.id}).exec()
        .then(result => {
            res.status(200).send({
                success: true,
                message: 'User deleted'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                success: false,
                error: err
            });
        });
});

// auth logout
// router.get('/logout', (req, res) => {
//     try {
//         const token = req.headers.authorization.split(" ")[1];
//         const decoded = jwt.verify(token, process.env.JWT_KEY, { maxAge: 0 });
//         res.redirect('/');    
//     } catch {
//         return res.status(401).send({
//             success: false,
//             message: 'Auth failed'
//         });
//     }
    
// });

router.put('/activate/:token', (req, res, next) => {
    User.findOne({ temporarytoken: req.params.token }).exec()
        .then((user) => {
            console.log('section 1');
            // if (err) throw err;
            const token = req.params.token;
            console.log(token);
            console.log('section 2');
            jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
                if(err) {
                    res.send({
                        success: false,
                        message: 'Activation link has expired'
                    });
                } else if (!user) {
                    res.send({
                        success: false,
                        message: 'Activation link has expired'
                    });
                } else {
                    user.temporarytoken = false;
                    user.isActive = true;
                    user.save()
                    .then(result => {

                        // send account activated e-mail
                        const subject = 'Localhost Account Activated';
                        const html = 'Hello<b> ' + result.name + '</b><br><br>Your account has been successfully activated!';
                        const text = 'Hello ' + result.name + ', your account has been successfully activated!';
                                
                        sendMail(result.email, subject, html, text, function(err, data) {
                            
                            if (err) {
                                res.json({ message: 'Internal Error' });
                            } else {
                                res.json({ message: 'Email sent!!!' });
                            }
                        });

                        return res.send({
                            success: true,
                            message: 'Account activated'
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).send({
                            success: false,
                            error: err
                        });
                    });
                }
            });

        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                success: false,
                error: err
            });
        });
});

router.get('/renewToken/:email', (req, res, next) => {
    User.findOne({ email: req.params.email}).exec()
    .then(user => {
        if (!user) {
            return res.send({ success: false, message: 'No user was found' });
        } else {
            const newToken = jwt.sign({ name: user.name, email: user.email, _id: user._id }, process.env.JWT_KEY, { expiresIn: "1h" });

            return res.status(200).send({
                success: true,
                message: 'Auth successful',
                token: newToken
            });
        }
    })
    .catch(err => {
        console.log(err);
        return res.send({ success: false, message: err });
    });
});

module.exports = router;