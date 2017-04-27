myApp.controller('recipeController', ['$scope', '$location','UserService', 'RecipeDataService',
                                        function($scope, $location, UserService, RecipeDataService) {
  $scope.userObject = UserService.userObject;
  $scope.logout = UserService.logout;
  $scope.recipe = UserService.userObject.currentRecipe;

  console.log('recipeController loaded');
  console.log('current recipe is:', $scope.recipe);
  console.log('current user is:', UserService.userObject.userName);


}]);
