const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        // console.log(JSON.parse(token));
        jwt.verify(JSON.parse(token), process.env.JWT_KEY, (err, decoded) => {
            if(err) {
                console.log(err);
            }
            if (decoded) {
                req.userData = decoded;
                // console.log(req.userData);
                next();
            } else {
                return res.send({
                    success: false,
                    message: 'Auth failed'
                });
            }
        });
    } catch {
        // return res.status(401).send({
        //     message: 'Auth failed'
        // });
        return res.send({
            success: false,
            message: 'Auth failed'
        });
        // res.redirect('/');
    }
};