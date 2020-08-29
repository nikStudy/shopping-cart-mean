const path = require('path');
require('dotenv').config({path: __dirname + '../.env'})

const express = require('express');
const router = express.Router();
const Cart = require('../models/cart-model');
const Order = require('../models/order-model');
const checkAuth = require('../middleware/check-auth');
const sendMail = require('../mail/mail');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/order', checkAuth, (req, res, next) => {
   if (req.session.cart === undefined) {
      // console.log(req.session.cart);
      return res.send({success: false, message: 'No items in the cart... redirecting', error: 'redirect'});
   }

    let cart = new Cart(req.session.cart);

    const stripeToken = req.body.stripeToken;
    const price = cart.totalPrice;
    const priceInPence = price * 100;
   //  console.log('stripeToken ' + stripeToken);
   //  console.log('price ' + price);
   //  console.log('priceInPence ' + priceInPence);

    stripe.charges.create({
       amount: priceInPence,
       currency: 'inr',
       source: stripeToken,
       capture: false,
    }).then(chargeObject => {
      // console.log('section 1');
      return makeOrderCreation(req, res, next, chargeObject, cart);
    }).catch(error => {
      //  handleError(error);
      // console.log('section 5');
      return res.send({success: false, message: 'Transaction failed!!!', error: error});
    });
});

 
function makeOrderCreation(req, res, next, charge, cart) {
   // console.log('section 2 ' + charge.id);
    return stripe.charges.capture(charge.id)
      .then(result => {
         // console.log('section 3');
         // console.log(cart);
         const order = new Order({
            user: req.userData,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            paymentId: charge.id
         });
         // console.log(order);
         order.save().then(newOrder => {
            if (newOrder) {
               orderEmail(req.userData.email, req.userData.name, cart);
               req.session.cart = null;
               return res.send({success: true, message: 'Transaction completed successfully!!!'});
            }
         }).catch(err => {
               // console.log(err);
               return res.send({success: false, message: 'Transaction failed.!!', error: err});
         });
      }).catch(err => {
         // console.log('section 4');
         stripe.refunds.create({charge: charge.id})
         .then(result => {
            return res.send({success: false, message: 'Transaction failed. Refund processed!!', error: err});
         })
         .catch(err => err);
    });
};

function orderEmail(email, name, cart) {
   console.log(cart.generateArray());
   let cartString = '<table><tr style="text-align: left;"><th>#</th><th>Title</th><th style="padding-right: 15px;">Quantity</th><th>Price($)</th></tr>';
   let count = 1;
   cart.generateArray().forEach(product => {
      console.log(product);
      cartString += '<tr><td>' + count + '</td><td style="padding-right: 15px;">' + product.item.title + '</td><td>' + product.qty + '</td><td>' + product.price + '</td></tr>';
      count++;
   });

   cartString += '<tr><td colspan="4">Total Price: $' + cart.totalPrice + '</td></tr></table>';
   
   // send order successful confirmation email
   const subject = 'Localhost Order Successful';
   const html = 'Hello<b> ' + name + '</b><br><br>Thank you for placing the order at localhost.com. You will receive your products within 5-7 working days.<br><br><hr><h3>Order Summary</h3>' + cartString;
   const text = 'Hello ' + name + ', thank you for placing the order at localhost.com. You will receive your products within 5-7 working days.';
           
   sendMail(email, subject, html, text, function(err, data) {
       
       if (err) {
           res.json({ message: 'Internal Error' });
       } else {
           res.json({ message: 'Email sent!!!' });
       }
   });
};

module.exports = router;