const mongoose = require('mongoose');
const historySchema = new mongoose.Schema({
    product_list: {
        type: String,
        required: true,
    },
    total:{
        type: Number,
        required: true,
    },
    created: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

module.exports = mongoose.model('History', historySchema);