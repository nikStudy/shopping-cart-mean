const path = require('path');
require('dotenv').config({path: __dirname + '../.env'})

const router = require('express').Router();
const request = require('request');

router.post('/token_validate', (req, res) => {
    // console.log(req.body.recaptcha);

    if (
        req.body.recaptcha === undefined ||
        req.body.recaptcha === '' ||
        req.body.recaptcha === null
    ) {
        return res.send({
            success: false,
            message: 'Please select captcha'
        });
    }

    // secret key
    const secretKey = process.env.google_recaptcha_secret_key;

    // verify url
    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.recaptcha}&remoteip=${req.connection.remoteAddress}`;

    // make request to verify url
    request(verifyUrl, (err, response, body) => {
        body = JSON.parse(body);

        // if not successful
        if(body.success !== undefined && !body.success) {
            return res.send({
                success: false,
                message: 'Failed captcha verification'
            });
        }

        // if successful
        return res.send({
            success: true,
            message: 'Captcha passed'
        });
    });

});

module.exports = router;
