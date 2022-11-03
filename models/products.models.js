const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    stock:{
        type: Number,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    type_name: {
        type: String,
        required: true,
    },
    image:{
        type: String,
        required: true,
    },
    created: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

module.exports = mongoose.model('Product', productSchema);