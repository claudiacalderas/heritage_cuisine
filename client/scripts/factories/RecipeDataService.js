myApp.factory('RecipeDataService', ['$http', '$location', function($http, $location){

  console.log('Recipe Data Service Loaded');

  getRecipes = function(){
    // $http.get('/recipe').then(function(response) {
    //
    // });
  };

  postRecipe = function(recipe) {
    var recipeToPost = angular.copy(recipe);
    console.log('Posting recipe: ', recipeToPost);
    $http.post('/recipe/add', recipeToPost).then(function(response) {
      console.log(response);
    });
  };

  return {
    postRecipe : postRecipe,
  };

}]);
