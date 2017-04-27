myApp.controller('UserController', ['$scope', '$http', '$location', '$mdDialog', 'UserService', 'RecipeDataService',
                                    function($scope, $http, $location, $mdDialog, UserService, RecipeDataService) {
  $scope.userObject = UserService.userObject;
  $scope.logout = UserService.logout;
  $scope.recipesObject = RecipeDataService.recipesObject;

  // console.log('in usercontroller',$scope.userObject);
  // var myNameHere = $scope.userObject;
  // console.log(myNameHere.userName);
  console.log('STEP 2: retrieve username');
  console.log($scope.userObject);
  RecipeDataService.getRecipes($scope.userObject.userName);

  $scope.viewRecipe = function(recipe) {
    console.log('view recipe clicked',recipe);
  }

  $scope.delete = function(recipe) {
    console.log('delete recipe clicked',recipe);
    RecipeDataService.deleteRecipe(recipe);
  }

  $scope.showConfirm = function(ev,recipe) {
    // Appending dialog to document.body to cover sidenav in docs app
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




}]);
