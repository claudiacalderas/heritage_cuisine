var mongoose = require('mongoose');

var AllUserSchema = mongoose.Schema({
  username : String,
  name : String,
  email : String
});

module.exports = mongoose.model('allUsers', AllUserSchema, 'users');
