myApp.controller('UserController', ['$scope', '$http', '$location', '$mdDialog', 'UserService', 'RecipeDataService',
                                    function($scope, $http, $location, $mdDialog, UserService, RecipeDataService) {
  $scope.userObject = UserService.userObject;
  $scope.logout = UserService.logout;
  $scope.recipesObject = RecipeDataService.recipesObject;
  $scope.redirect = UserService.redirect;
  $scope.searchString = "";

  console.log('STEP 2: retrieve username');
  console.log($scope.userObject);
  
  // Gets all recipes in the recipe book for logged user
  RecipeDataService.getRecipes($scope.userObject.userName);

  // Calls factory functions to search recipe by name or get all recipes
  // if the search input is empty
  $scope.search = function() {
    console.log('search button clicked',$scope.searchString);
    if ($scope.searchString != "") {
      RecipeDataService.searchRecipes($scope.userObject.userName,$scope.searchString);
    } else {
      RecipeDataService.getRecipes($scope.userObject.userName);
    }
  };

  // Redirects to Recipe View
  $scope.viewRecipe = function(recipe) {
    console.log('view recipe clicked',recipe);
    UserService.userObject.currentRecipe = recipe;
    UserService.redirect('/recipe');
  };

  // Modal window that confirms recipe deletion
  $scope.showConfirm = function(ev,recipe) {
    var confirm = $mdDialog.confirm()
          .title('Would you like to delete this recipe?')
          .textContent('')
          .ariaLabel('Delete recipe')
          .targetEvent(ev)
          .ok('Delete')
          .cancel('Cancel');
    $mdDialog.show(confirm).then(function() {
      RecipeDataService.deleteRecipe(recipe);
      }, function() {
      console.log('Deletion cancelled');
    });
  };

  // Switches between favorite/notfavorite when user clicks on star icon
  $scope.toggleFavorite = function(recipe) {
    console.log('toggleFavorite clicked',recipe);
    // changes recipe's favorite field
    recipe.favorite = !recipe.favorite;
    // updates recipe
    RecipeDataService.updateRecipe(recipe);
  };

}]);
