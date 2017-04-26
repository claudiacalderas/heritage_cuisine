var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var FamilyRecipeSchema = mongoose.Schema({
  recipe_id : String
  title : String,
  ingredients : [],
  steps : [],
  image_url: String,
  username: String
});

var Recipe = mongoose.model('recipe', FamilyRecipeSchema, 'recipes');

// saves a recipe into the database
router.post('/add', function(req,res) {
  console.log("/add post route hit");
  var recipe = new Recipe();
  recipe.recipe_id = '';
  recipe.title = req.body.title;
  recipe.ingredients = req.body.ingredients;
  recipe.steps = req.body.steps;
  recipe.image_url = '';
  recipe.username = req.body.username;

  recipe.save(function(err, savedRecipe){
  if(err){
    console.log("Mongo error:", err);
    res.sendStatus(500);
  }
  res.send(savedRecipe);
  });
});


module.exports = router;
