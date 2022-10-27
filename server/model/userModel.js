const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    min: 3,
    max: 20,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  surveys: { type: Array, default: [] },
  amount: { type: Number, default: 0 },
});

module.exports = mongoose.model('User', userSchema);
