if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/products-routes');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const googleRoutes = require('./routes/google-routes');
const githubRoutes = require('./routes/github-routes');
const captchaRoutes = require('./routes/captcha-routes');
const resetRoutes = require('./routes/reset-routes');
const permissionRoutes = require('./routes/permission-routes');
const stripeRoutes = require('./routes/stripe-routes');
// const flash = require('express-flash');
const passportSetup = require('./config/passport-setup');
const cookieSession = require('cookie-session');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);

const cors = require('cors');

const app = express();

app.use(cors());

// connect to mongodb
// mongoose.connect(process.env.MONGODB_KEY, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true
//     }, () => {
//         console.log('connected to mongodb');
// });
mongoose.connect('mongodb://localhost/userLogin', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, () => {
    console.log('connected to mongodb');
});
mongoose.Promise = global.Promise;

// setup view engine
// app.set('view engine', 'ejs');

app.use('/uploads', express.static('uploads'));

app.use(express.urlencoded({extended: false}));
app.use(express.json());

// app.use(cookieSession({
//     maxAge: 24 * 60 * 60 * 1000,
//     keys: [process.env.cookieSession_Key]
// }));
app.use(session({
    secret: process.env.cookieSession_Key,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 3 * 60 * 60 * 1000 }
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());




// app.use(flash());


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    if(req.method === 'OPTIONS') {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});



// setup routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/auth', googleRoutes);
app.use('/api/auth', githubRoutes);
app.use('/api', captchaRoutes);
app.use('/api/auth', resetRoutes);
app.use('/api', permissionRoutes);
app.use('/api', productRoutes);
app.use('/api', stripeRoutes);
// app.use('/auth', authRoutes);
// app.use('/profile', profileRoutes);
// app.use('/auth', googleRoutes);
// app.use('/auth', githubRoutes);
// app.use(captchaRoutes);
// app.use('/auth', resetRoutes);
// app.use('/api', permissionRoutes);
// app.use('/api', productRoutes);


// listen for requests
app.listen(process.env.PORT || 4000, () => {
    console.log('app now listening for requests on port 4000');
});