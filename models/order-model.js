const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create order Schema
const OrderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    cart: {
        type: Object,
        required: [true, 'Cart field is required']
    },
    address: {
        type: String,
        required: [true, 'Address field is required']
    },
    name: {
        type: String,
        required: [true, 'Name field is required']
    },
    paymentId: {
        type: String,
        required: [true, 'PaymentId field is required']
    }
});

// create order model
const Order = mongoose.model('order', OrderSchema);

module.exports = Order;