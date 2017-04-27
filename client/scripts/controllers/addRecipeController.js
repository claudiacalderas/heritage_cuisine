myApp.controller('addRecipeController', ['$scope', '$location','UserService', 'RecipeDataService',
                                        function($scope, $location, UserService, RecipeDataService) {
  $scope.userObject = UserService.userObject;
  $scope.logout = UserService.logout;
  $scope.redirect = UserService.redirect;
  $scope.title = '';
  $scope.ingredientsArray = [];
  $scope.stepsArray = [];
  $scope.recipe = {
    title: '',
    categories : [],
    ingredients : [],
    steps : [],
    image_url: '',
    username: ''
  };
  $scope.categoryOptions = ['Dessert', 'Appetizer', 'Dinner'];


  $scope.addNewIngredient = function() {
      var newIngredientNo = $scope.ingredientsArray.length+1;
      console.log('Adding new ingredient');
      $scope.ingredientsArray.push({'id':'I' + newIngredientNo});
      console.log('Ingredients Array is now:', $scope.ingredientsArray);
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
      console.log('Steps Array is now:', $scope.stepsArray);
  };

  $scope.removeStep = function(step) {
      console.log('Removing step');
      var stepIndex = $scope.stepsArray.indexOf(step);
      $scope.stepsArray.splice(stepIndex,1);
  };

  $scope.addRecipe = function() {
    // initializes arrays in recipe object
    $scope.recipe.ingredients = [];
    $scope.recipe.steps = [];
    $scope.recipe.title = $scope.title;
    $scope.recipe.categories = $scope.categoryOptions;
    $scope.recipe.username = $scope.userObject.userName;

    // formats array of ingredients into db schema format
    for (var i = 0; i < $scope.ingredientsArray.length; i++) {
      $scope.recipe.ingredients.push($scope.ingredientsArray[i].name);
    }
    // formats array of steps into db schema format
    for (var j = 0; j < $scope.stepsArray.length; j++) {
      $scope.recipe.steps.push($scope.stepsArray[j].name);
    }

    // temporary image_url until add photo is implemented
    $scope.recipe.image_url = '';

    console.log('Adding a recipe', $scope.recipe);
    RecipeDataService.postRecipe($scope.recipe);

    // clear input fields
    $scope.title = ' ';
    $scope.ingredientsArray = [];
    $scope.stepsArray = [];
    $scope.categoryOptions = [];
  } // end of addRecipe function

  // $scope.redirect = function(page){
  //   console.log('nav clicked', page);
  //   $location.url(page);
  // }

}]);
