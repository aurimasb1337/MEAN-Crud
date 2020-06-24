const db = require('../config/db');
const { DB_CONNECT_ERR } = require('../config/errors');
const mongoose = require('mongoose');
var textSearch = require('mongoose-text-search');

if (!db) {
    throw new Error(DB_CONNECT_ERR)
}

const schema = new mongoose.Schema({
    owner: {
        type: String,
        required: true
    },

    plateNumber: {
        type: String,
        required: true
    },

    status: { // whether record is available or not available(deleted)
        type: Boolean,
        required: true,
        default: true
    }
});

schema.plugin(textSearch);
schema.index({ owner: 'text', plateNumber: 'text' });

module.exports = mongoose.model('NumberPlate', schema);