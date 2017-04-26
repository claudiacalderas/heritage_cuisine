myApp.factory('RecipeDataService', ['$http', '$location', function($http, $location){

  console.log('Recipe Data Service Loaded');

  var recipesObject = {
    allRecipes: []
  };

  getRecipes = function(){
    console.log('in getRecipes');
    $http.get('/recipe').then(function(response) {
      console.log('Back from the server with:', response);
      recipesObject.allRecipes = response.data;
      console.log('Updated recipesObject:', recipesObject.allRecipes);
    });
  };

  postRecipe = function(recipe) {
    var recipeToPost = angular.copy(recipe);
    console.log('Posting recipe: ', recipeToPost);
    $http.post('/recipe/add', recipeToPost).then(function(response) {
      console.log(response);
    });
  };

  return {
    recipesObject : recipesObject,
    getRecipes : getRecipes,
    postRecipe : postRecipe
  };

}]);
