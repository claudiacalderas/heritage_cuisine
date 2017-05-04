myApp.factory('RecipeDataService', ['$http', '$location', function($http, $location){

  console.log('Recipe Data Service Loaded');

  // Stores all recipes associated with the logged user
  var recipesObject = {
    allRecipes: []
  };

  // Gets all recipes in the database for a specific uset
  getRecipes = function(user){
    var username = angular.copy(user);
    console.log('in getRecipes with user', username);
    $http.get('/recipe/' + username).then(function(response) {
      console.log('Back from the server with:', response);
      recipesObject.allRecipes = response.data;
      console.log('Updated recipesObject:', recipesObject.allRecipes);
    });
  };

  // Searches recipes based on a specific user and by recipe name
  searchRecipes = function(user,searchString){
    var username = angular.copy(user);
    console.log('in searchRecipes with user', username);
    console.log('in searchRecipes searchString is', searchString);
    $http.get('/recipe/search/' + username + '/' + searchString).then(function(response) {
      console.log('Back from the server with:', response);
      recipesObject.allRecipes = response.data;
      console.log('Updated recipesObject:', recipesObject.allRecipes);
    });
  };

  // Posts a new recipe to the database
  postRecipe = function(recipe) {
    var recipeToPost = angular.copy(recipe);
    var username = recipeToPost.username;
    console.log('Posting recipe: ', recipeToPost);
    $http.post('/recipe/add', recipeToPost).then(function(response) {
      getRecipes(username);
    });
  };

  // Updates a specific recipe
  updateRecipe = function(recipe) {
    var recipeToUpdate = angular.copy(recipe);
    var username = recipeToUpdate.username;
    console.log('Updating recipe: ', recipeToUpdate);
    $http.put('/recipe/update', recipeToUpdate).then(function(response) {
      getRecipes(username);
    });
  };

  // Deletes a specific recipe
  deleteRecipe = function(recipe) {
    console.log('Deleting recipe: ',recipe);
    var username = recipe.username;
    $http.delete('/recipe/delete/' + recipe._id).then(function(response) {
      getRecipes(username);
    });
  };

  // Shares a recipe with selected users. Receives an array with the documents
  // that will be inserted in the recipes collection
  shareRecipeWithGroups = function(arrayToPost, user) {
    console.log('Sharing recipes: ', arrayToPost);
    $http.post('/recipe/share', arrayToPost).then(function(response) {
      console.log('In shareRecipeWithGroups back from the server',response);
    });
  };

  return {
    recipesObject : recipesObject,
    getRecipes : getRecipes,
    postRecipe : postRecipe,
    updateRecipe : updateRecipe,
    deleteRecipe : deleteRecipe,
    shareRecipeWithGroups : shareRecipeWithGroups,
    searchRecipes : searchRecipes
  };

}]);
