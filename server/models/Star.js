const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const starSchema = new Schema({
  hip: {
    type: String,
    unique: true
  },
  location: {
    type: {type: String, default: 'Point'},
    coordinates: {type: [Number], default: [0, 0]}
}
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Star = mongoose.model('Star', starSchema);
module.exports = Star;
