const express = require('express');
const router = express.Router();
const Product = require('../models/product-model');
const multer = require('multer');
const Cart = require('../models/cart-model');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);    // accept a file
    } else {
        cb(null, false);    // reject a file
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});
// const upload = multer({dest: 'uploads/'});

// get a list of all products from the db
router.get('/products', function(req, res, next){
    Product.find({}).then(function(products){
        if(products.length === 0) {
            return res.send({ success: false, message: 'There are no products in the db' });
        } else {
            res.send({ success: true, products: products });
        }
    }).catch(err => {
        console.log(err);
        return res.send({ success: false, message: err });
    });
});

// add a new product to the db
router.post('/products', upload.single('productImage'), function(req, res, next){
    console.log(req.file);
    const product = new Product({
        title: req.body.title,
        short_descrip: req.body.short_descrip,
        image: req.file.originalname,
        price: req.body.price
    });

    Product.find({title: req.body.title}).then(function(products){
        if(products.length === 0){
            product.save().then(function(prod){
                return res.send({ success: true, message: 'Product Created', product: prod });
            }).catch(err => {
                console.log(err);
                return res.send({ success: false, message: err });
            });
        } else {
            // console.log(products);
            res.send({ success: false, message: 'Product with the same title is present in the db.'});
        }
    }).catch(err => {
        console.log(err);
        return res.send({ success: false, message: err });
    });
});

// add a product to the cart
router.get('/add-to-cart/:id', (req, res, next) => {
    let productId = req.params.id;
    // console.log(req.session.cart);
    let cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId).then(product => {
        if (!product) {
            res.send({ success: false, message: 'Product does not exist.'});
        } else {
            cart.add(product, product.id);
            req.session.cart = cart;
            console.log(req.session.cart);
            res.send({cart: req.session.cart});
        }
    }).catch(err => {
        console.log(err);
        return res.send({ success: false, message: err });
    });
});

// reduce single item from the cart
router.get('/reduce/:id', (req, res, next) => {
    let productId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.send({ success: true, message: 'Cart item reduced by one.'});
});

// remove all items of single product from the cart
router.get('/remove/:id', (req, res, next) => {
    let productId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.send({ success: true, message: 'All cart items removed for this product.'});
});

// send total records in the cart
router.get('/cart-total-records', (req, res, next) => {
    if (!req.session.cart) {
        res.send({ success: false, message: 'There are no products in the cart'});
    } else {
        res.send({ success: true, totalRecords: req.session.cart.totalQty});
    }
});

// send cart
router.get('/shopping-cart', (req, res, next) => {
    if (!req.session.cart) {
        res.send({ success: false, message: 'There are no products in the cart... Redirecting', products: null});
    } else {
        let cart = new Cart(req.session.cart);
        res.send({ success: true, products: cart.generateArray(), totalPrice: cart.totalPrice});
    }
});

// set oldUrl on clicking of checkout button in frontend 
router.get('/checkout', (req, res, next) => {
    if (!req.session.cart) {
        return res.send({ success: false, message: 'There are no products in the cart'});
    } else {
        req.session.oldUrl = 'checkout';
        // console.log(req.session.oldUrl);
        return res.send({ success: true });
    }
});

module.exports = router;