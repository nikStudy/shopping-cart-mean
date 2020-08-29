const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create product Schema
const ProductSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title field is required']
    },
    short_descrip: {
        type: String,
        required: [true, 'Short description field is required']
    },
    image: {
        type: String,
        required: [true, 'Image field is required']
    },
    price: {
        type: Number,
        required: [true, 'Price field is required']
    }
});

// create product model
const Product = mongoose.model('product', ProductSchema);

module.exports = Product;