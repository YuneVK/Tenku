const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const starSchema = new Schema({
  hip: String,
  coordinates: {
    ra: Number,
    dec: Number
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Star = mongoose.model('Star', starSchema);
module.exports = Star;
