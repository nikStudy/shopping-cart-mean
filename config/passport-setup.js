const path = require('path');
require('dotenv').config({path: __dirname + '../.env'})

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const GithubStrategy = require('passport-github2').Strategy;
const GithubStrategy = require('passport-github').Strategy;
const User = require('../models/user-model');
const jwt = require('jsonwebtoken');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy({
        // options for the google strategy
        callbackURL: '/auth/google/redirect',
        clientID: process.env.google_clientID,
        clientSecret: process.env.google_clientSecret
    }, (accessToken, refreshToken, profile, done) => {
        // console.log('passport callback function fired');
        console.log(profile);

        // check if user already exists in our db
        User.findOne({googleId: profile.id, email: profile.emails[0].value}).then((currentUser) => {
            if(currentUser) {
                // user already exists
                console.log('user is: ', currentUser);
                done(null, currentUser);
            } else {
                User.findOneAndUpdate({email: profile.emails[0].value}, {
                    name: profile.displayName,
                    username: profile.displayName,
                    googleId: profile.id,
                    temporarytoken: jwt.sign({ name: profile.displayName, email: profile.emails[0].value }, process.env.JWT_KEY, { expiresIn: "1h" })
                    // thumbnail: profile._json.picture
                }).then((curUser) => {
                    if(curUser) {
                        // user already exists
                        console.log('user is: ', curUser);
                        done(null, curUser);
                    } else {
                        // create a new user in our db
                        new User({
                            name: profile.displayName,
                            username: profile.displayName,
                            googleId: profile.id,
                            email: profile.emails[0].value,
                            temporarytoken: jwt.sign({ name: profile.displayName, email: profile.emails[0].value }, process.env.JWT_KEY, { expiresIn: "1h" })
                            // thumbnail: profile._json.picture
                        }).save().then((newUser) => {
                            console.log('new user created' + newUser);
                            done(null, newUser);
                        });
                    }
                });
            }
        });

    })
);

passport.use(
    new GithubStrategy({
        // options for the github strategy
        callbackURL: '/auth/github/redirect',
        clientID: process.env.github_clientID,
        clientSecret: process.env.github_clientSecret
    }, (accessToken, refreshToken, profile, done) => {
        // console.log('passport callback function fired');
        console.log(profile);
        console.log(accessToken);

        // check if user already exists in our db
        User.findOne({githubId: profile.id}).then((currentUser) => {
            if(currentUser) {
                // user already exists
                console.log('user is: ', currentUser);
                done(null, currentUser);
            } else {
                // create a new user in our db
                new User({
                    name: profile.username,
                    username: profile.username,
                    githubId: profile.id
                    // thumbnail: profile._json.picture
                }).save().then((newUser) => {
                    console.log('new user created' + newUser);
                    done(null, newUser);
                });
            }
        });

    })
);
