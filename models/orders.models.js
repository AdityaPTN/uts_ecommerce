const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    product_list: {
        type: String,
        required: true,
    },
    total:{
        type: Number,
        required: true,
    },
    status:{
        type: String,
        required: true,
    },
    code:{
        type: String,
    },
    created: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

module.exports = mongoose.model('Order', orderSchema);