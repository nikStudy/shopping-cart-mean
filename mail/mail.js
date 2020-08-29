const path = require('path');
require('dotenv').config({path: __dirname + '../.env'})

const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');

// step 1
const auth = {
    auth: {
        api_key: process.env.MAILGUN_api_key,
        domain: process.env.MAILGUN_domain
    }
};

// step 2
const transporter = nodemailer.createTransport(mailGun(auth));

// step 5
const sendMail = (email, subject, html, text, cb) => {

    // step 3
    const mailOptions = {
        // from: 'Excited User <me@samples.mailgun.org>',
        // to: 'nikhil.mittal60@gmail.com',
        // subject: 'Welcome to my App',
        // text: 'It is working'
        from: 'Localhost Staff <me@samples.mailgun.org>',
        to: email,
        subject: subject,
        html: html,
        text: text
    }

    // // step 3
    // const mailOptions = {
    //     // from: 'Excited User <me@samples.mailgun.org>',
    //     // to: 'nikhil.mittal60@gmail.com',
    //     // subject: 'Welcome to my App',
    //     // text: 'It is working'
    //     from: 'Localhost Staff <me@samples.mailgun.org>',
    //     to: email,
    //     subject: 'Localhost Activation Link',
    //     html: 'Hello<b> ' + name + '</b><br><br>Thank you for registering at localhost.com. Please click on the link below to complete your activation: <br><br><a href="http://localhost:4200/activate/" + temporarytoken + "">http://localhost:4200/activate/</a>',
    //     text: 'Hello ' + name + ', thank you for registering at localhost.com. Please click on the following link to complete your activation: http://localhost:4200/activate/' + temporarytoken
    // }

    // step 4
    transporter.sendMail(mailOptions, function(err, data) {
        if (err) {
            console.log('Error: '. err);
        } else {
            console.log('Message sent!!!');
        }
    });

}

module.exports = sendMail;