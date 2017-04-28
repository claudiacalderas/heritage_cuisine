var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var GroupSchema = mongoose.Schema({
  group_id : String,
  group_name : String,
  username : String,
  is_admin : Boolean,
});

var Group = mongoose.model('group', GroupSchema, 'groups');

// gets all groups from the database for a specific user
router.get('/:user', function(req, res){
  console.log("/group get route hit");
  var searchUsername = req.params.user;
  console.log('username is: ', searchUsername);
  Group.find({username: searchUsername},function(err, allGroups) {
    if(err) {
      console.log('Mongo error: ', err);
    }
    res.send(allGroups);
  });
});

// saves a group document into the database
router.post('/add', function(req, res) {
  console.log("/add group post route hit");
  var group = new Group();

  // call a function that will generate a group_id if new group
  group.group_id = '';
  group.group_name = req.body.group_name;
  group.username = req.body.username;
  group.is_admin = req.body.is_admin;

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
