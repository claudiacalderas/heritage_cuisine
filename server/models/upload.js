var mongoose = require('mongoose');

// Picture upload Schema
var UploadSchema = mongoose.Schema({
  name: String,
  created: Date,
  file: Object
});

module.exports = mongoose.model('Upload', UploadSchema);
