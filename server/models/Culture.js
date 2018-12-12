const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const cultureSchema = new Schema({
  name: {
    type: String,
    unique: true
  }, 
  constellations: [{ type : Schema.Types.ObjectId, ref: 'Constellation' }],
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Culture = mongoose.model('Culture', cultureSchema);
module.exports = Culture;
