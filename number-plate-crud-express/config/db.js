const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/numberPlateCRUD", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', () => {
    console.error('Mongoose connection error');
});

db.on('connect', () => {
    console.log('database ready');
});

module.exports = db;
