var mongoose = require('mongoose');

// All users registered in the app Schema
var AllUserSchema = mongoose.Schema({
  username : String,
  name : String,
  email : String
});

module.exports = mongoose.model('allUsers', AllUserSchema, 'users');
