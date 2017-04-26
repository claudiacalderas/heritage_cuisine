myApp.controller('UserController', ['$scope', '$http', '$location', 'UserService', 'RecipeDataService',
                                    function($scope, $http, $location, UserService, RecipeDataService) {
  $scope.userObject = UserService.userObject;
  $scope.logout = UserService.logout;
  $scope.recipesObject = RecipeDataService.recipesObject;

  RecipeDataService.getRecipes();

  $scope.viewRecipe = function() {
    console.log('view recipe clicked');
  }


}]);
