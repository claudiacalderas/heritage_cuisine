myApp.factory('RecipeDataService', ['$http', '$location', function($http, $location){

  console.log('Recipe Data Service Loaded');

  var recipesObject = {
    allRecipes: []
  };

  getRecipes = function(user){
    var username = angular.copy(user);
    console.log('in getRecipes with user', username);

    $http.get('/recipe/' + username).then(function(response) {
      console.log('Back from the server with:', response);
      recipesObject.allRecipes = response.data;
      console.log('Updated recipesObject:', recipesObject.allRecipes);
    });
  };

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

  postRecipe = function(recipe) {
    var recipeToPost = angular.copy(recipe);
    var username = recipeToPost.username;
    console.log('Posting recipe: ', recipeToPost);
    $http.post('/recipe/add', recipeToPost).then(function(response) {
      getRecipes(username);
    });
  };

  updateRecipe = function(recipe) {
    var recipeToUpdate = angular.copy(recipe);
    var username = recipeToUpdate.username;
    console.log('Updating recipe: ', recipeToUpdate);
    $http.put('/recipe/update', recipeToUpdate).then(function(response) {
      getRecipes(username);
    });
  };

  deleteRecipe = function(recipe) {
    console.log('Deleting recipe: ',recipe);
    var username = recipe.username;
    $http.delete('/recipe/delete/' + recipe._id).then(function(response) {
      getRecipes(username);
    });
  };

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
