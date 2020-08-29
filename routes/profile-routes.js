const router = require('express').Router();
const checkAuth = require('../middleware/check-auth');
const Order = require('../models/order-model');
const Cart = require('../models/cart-model');

router.get('/', checkAuth, (req, res) => {
    Order.find({user: req.userData})
    .then(orders => {
        let cart;
        orders.forEach(order => {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        });
        res.send({user: req.userData, success: true, orders: orders});
    })
    .catch(err => {
        console.log(err);
        return res.send({ success: false, message: err });
    });
});


module.exports = router;