myApp.controller('addRecipeController', ['$scope','UserService', function($scope, UserService) {
  $scope.userObject = UserService.userObject;
  $scope.logout = UserService.logout;

  $scope.ingredientsArray = [];
  $scope.stepsArray = [];

  $scope.recipe = {
    title: '',
    ingredients : [''],
    steps : [],
    image_url: '',
    username: ''
  };

  $scope.addNewIngredient = function() {
      var newIngredientNo = $scope.ingredientsArray.length+1;
      console.log('Adding new ingredient');
      $scope.ingredientsArray.push({'id':'I' + newIngredientNo});
      console.log('array is now:', $scope.ingredientsArray);
  };

  $scope.removeIngredient = function(ingredient) {
      console.log('Removing ingredient');
      var ingredientIndex = $scope.ingredientsArray.indexOf(ingredient);
      $scope.ingredientsArray.splice(ingredientIndex,1);
  };

  $scope.addNewStep = function() {
      var newStepNo = $scope.stepsArray.length+1;
      console.log('Adding new step');
      $scope.stepsArray.push({'id':'I' + newStepNo});
      console.log('array is now:', $scope.stepsArray);
  };

  $scope.removeStep = function(step) {
      console.log('Removing step');
      var stepIndex = $scope.stepsArray.indexOf(step);
      $scope.stepsArray.splice(stepIndex,1);
  };

  $scope.addRecipe = function() {
    console.log('Adding a recipe', $scope.recipe.title);
  }

}]);
