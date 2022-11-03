const mongoose = require('mongoose');
const typeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category_name: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

module.exports = mongoose.model('Type', typeSchema);