var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var FamilyRecipeSchema = mongoose.Schema({
  title : String,
  categories : [],
  ingredients : [],
  steps : [],
  image_url: String,
  username: String,
  favorite: Boolean
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
  }).sort( { favorite: -1 } );
});

// saves a recipe into the database
router.post('/add', function(req,res) {
  console.log("/add post route hit");
  var recipe = new Recipe();
  recipe.title = req.body.title;
  recipe.categories = req.body.categories;
  recipe.ingredients = req.body.ingredients;
  recipe.steps = req.body.steps;
  recipe.image_url = '';
  recipe.username = req.body.username;
  recipe.favorite = false;
  recipe.save(function(err, savedRecipe){
  if(err){
    console.log("Mongo error:", err);
    res.sendStatus(500);
  }
  res.send(savedRecipe);
  });
});

// updates recipe information
router.put("/update", function(req,res){
  var recipe = req.body;
  Recipe.findById(recipe._id, function(err, foundRecipe){
    if(err){
      console.log(err);
      res.sendStatus(500);
    }
    foundRecipe.title = req.body.title;
    foundRecipe.categories = req.body.categories;
    foundRecipe.ingredients = req.body.ingredients;
    foundRecipe.steps = req.body.steps;
    foundRecipe.image_url = req.body.image_url;
    foundRecipe.favorite = req.body.favorite;
    foundRecipe.save(function(err, savedRecipe){
      if(err){
        console.log(err);
        res.sendStatus(500);
      }
      res.send(savedRecipe);
    });
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

// saves many recipes into the database (sharing functionality)
router.post('/share', function(req,res) {
  console.log("/share post route hit");
  var arrayOfRecipes = req.body;
  Recipe.insertMany(arrayOfRecipes, function(err, savedRecipes){
  if(err){
    console.log("Mongo error:", err);
    res.sendStatus(500);
  }
  res.send(savedRecipes);
  });
});

module.exports = router;
