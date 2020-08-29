const path = require('path');
require('dotenv').config({path: __dirname + '../.env'})

const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

// auth with github
router.get('/github', passport.authenticate('github', {
    scope: [ 'user:email' ]
}));

// callback route for github to redirect to
router.get('/github/redirect', passport.authenticate('github', 
    { failureRedirect: 'http://localhost:4200/login' }), (req, res) => {
    // res.send(req.user);
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
});

module.exports = router;