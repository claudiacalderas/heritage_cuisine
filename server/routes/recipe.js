var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var FamilyRecipeSchema = mongoose.Schema({
  recipe_id : String,
  title : String,
  categories : [],
  ingredients : [],
  steps : [],
  image_url: String,
  username: String
});

var Recipe = mongoose.model('recipe', FamilyRecipeSchema, 'recipes');

// gets all recipes from the database
router.get('/:user', function(req,res){
  console.log("/recipe get route hit");
  var searchUsername = req.params.user;
  console.log('username is: ', searchUsername);
  Recipe.find({username: searchUsername},function(err,allRecipes) {
    if(err) {
      console.log('Mongo error: ',err);
    }
    res.send(allRecipes);
  });
});


// saves a recipe into the database
router.post('/add', function(req,res) {
  console.log("/add post route hit");
  var recipe = new Recipe();
  recipe.recipe_id = '';
  recipe.title = req.body.title;
  recipe.categories = req.body.categories;
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

// deletes a recipe from the database
router.delete('/delete/:id', function(req,res) {
  console.log("/delete route hit");
  var id = req.params.id;
  Recipe.findByIdAndRemove(id, function(err, deletedRecipe){
    if(err){
      console.log('Delete error', err);
      res.sendStatus(500);
    }
      res.send(deletedRecipe);
    });
});


module.exports = router;
