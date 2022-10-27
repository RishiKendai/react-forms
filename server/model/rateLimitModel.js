const mongoose = require('mongoose');

const rateLimitSchema = new mongoose.Schema({
  ipAddress: String,
  value: String,
});
module.exports = mongoose.model('RateLimitter', rateLimitSchema);
