var mongoose = require('mongoose');
var OrderSchema = new mongoose.Schema({
  id: Number,
  name: String,
  completed: Boolean,
  note: String,
  updated_at: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Order', OrderSchema);
