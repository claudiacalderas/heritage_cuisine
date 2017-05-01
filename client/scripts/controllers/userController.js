myApp.controller('UserController', ['$scope', '$http', '$location', '$mdDialog', 'UserService', 'RecipeDataService',
                                    function($scope, $http, $location, $mdDialog, UserService, RecipeDataService) {
  $scope.userObject = UserService.userObject;
  $scope.logout = UserService.logout;
  $scope.recipesObject = RecipeDataService.recipesObject;
  $scope.redirect = UserService.redirect;

  console.log('STEP 2: retrieve username');
  console.log($scope.userObject);
  RecipeDataService.getRecipes($scope.userObject.userName);

  $scope.viewRecipe = function(recipe) {
    console.log('view recipe clicked',recipe);
    UserService.userObject.currentRecipe = recipe;
    UserService.redirect('/recipe');
  };

  // modal window that confirms recipe deletion
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

  $scope.toggleFavorite = function(recipe) {
    console.log('toggleFavorite clicked',recipe);
    // changes recipe's favorite field
    recipe.favorite = !recipe.favorite;
    // updates recipe
    RecipeDataService.updateRecipe(recipe);
  };

}]);
