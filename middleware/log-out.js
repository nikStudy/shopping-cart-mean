const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        // console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_KEY, { maxAge: 5 });
        next();
    } catch {
        return res.status(401).send({
            message: 'Auth failed'
        });
    }
};