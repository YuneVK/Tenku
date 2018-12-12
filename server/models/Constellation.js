const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const constellationSchema = new Schema({
  id: String,
  name: {
    type: String,
    unique: true
  }, 
  culture: String,
  lines: String, 
  points: Array
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Constellation = mongoose.model('Constellation', constellationSchema);
module.exports = Constellation;
