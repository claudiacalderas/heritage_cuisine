var mongoose = require('mongoose');

var GroupSchema = mongoose.Schema({
  group_name : String,
  user_admin : String,
  users : [],
});

module.exports = mongoose.model('group', GroupSchema, 'groups');
