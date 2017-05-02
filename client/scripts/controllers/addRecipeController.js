myApp.controller('addRecipeController', ['$scope', '$location','Upload','$timeout','UserService', 'RecipeDataService',
                                        function($scope, $location, Upload, $timeout, UserService, RecipeDataService) {
  $scope.userObject = UserService.userObject;
  $scope.logout = UserService.logout;
  $scope.redirect = UserService.redirect;
  $scope.recipe = UserService.userObject.currentRecipe;
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
  var filename;

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

    // assign image_url (from uploaded img insert into the db)
    $scope.recipe.image_url = filename;

    console.log('Adding a recipe', $scope.recipe);
    RecipeDataService.postRecipe($scope.recipe);

    UserService.redirect('/user');
  } // end of addRecipe function

  // Upload file Section
  $scope.uploadPic = function(file) {
    file.upload = Upload.upload({
      url: '/uploads',
      data: {name: UserService.userObject.userName, file: file},
    });

    file.upload.then(function (response) {
      console.log('0 Back from upload with data:',response.data);
      // saves filename to use when saving recipe
      filename = response.data.file.path + "/" + response.data.file.originalname;

      $timeout(function () {
        file.result = response.data;
        console.log('1 Back from upload with data:',response.data);
        filename = response.data.file.path + "/" + response.data.file.originalname;
        console.log('URL is:',filename);

      });
      }, function (response) {
        if (response.status > 0)
          $scope.errorMsg = response.status + ': ' + response.data;
          console.log('2 Back from upload with data:',response.data);
          console.log('URL is:',filename);

      }, function (evt) {
        // Math.min is to fix IE which reports 200% sometimes
        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      });
    }

}]);
