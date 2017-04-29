var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var GroupSchema = mongoose.Schema({
  group_name : String,
  user_admin : String,
  users : [],
});

var AllUserSchema = mongoose.Schema({
  username : String,
  name : String,
  email : String
});

var Group = mongoose.model('group', GroupSchema, 'groups');
var AllUsers = mongoose.model('allUsers', AllUserSchema, 'users');


// gets all groups from the database for a specific user
router.get('/:user', function(req, res){
  console.log("/group get route hit");
  var searchUsername = req.params.user;
  console.log('username is: ', searchUsername);
  Group.find({users: {$in: [searchUsername]}},function(err, allGroups) {
    if(err) {
      console.log('Mongo error: ', err);
    }
    res.send(allGroups);
  });
});

// gets all users from the database except the parameter user
router.get('/users/:user', function(req, res){
  console.log("/group/users get route hit");
  var searchUsername = req.params.user;
  console.log('username is: ', searchUsername);
  AllUsers.find({username: {$ne: searchUsername}},function(err, allUsers) {
    if(err) {
      console.log('Mongo error: ', err);
    }
    res.send(allUsers);
  });
});

// saves a group document into the database
router.post('/add', function(req, res) {
  console.log("/add group post route hit");
  var group = new Group();
  group.group_name = req.body.group_name;
  group.user_admin = req.body.user_admin;
  group.users = req.body.users;
  group.save(function(err, savedGroup){
  if(err){
    console.log("Mongo error:", err);
    res.sendStatus(500);
  }
  res.send(savedGroup);
  });
});

// deletes a group document from the database
router.delete('/delete/:id', function(req,res) {
  console.log("/delete group route hit");
  var id = req.params.id;

  Group.findByIdAndRemove(id, function(err, deletedGroup){
    if(err){
      console.log('Delete error', err);
      res.sendStatus(500);
    }
      res.send(deletedGroup);
    });
});


module.exports = router;
