var mongoose = require('mongoose');

var FamilyRecipeSchema = mongoose.Schema({
  title : String,
  categories : [],
  ingredients : [],
  steps : [],
  image_url: String,
  username: String,
  favorite: Boolean,
});

module.exports = mongoose.model('recipe', FamilyRecipeSchema, 'recipes');
