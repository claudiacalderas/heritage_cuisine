myApp.controller('editRecipeController', ['$scope','$location','Upload','$timeout','UserService','RecipeDataService',
                                        function($scope,$location,Upload,$timeout,UserService,RecipeDataService) {
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
  $scope.categoryOptions = [];
  // filename stores the picture filename assigned by the uploadPic function
  var filename;

  // function that gets the currentRecipe object stored in the factory and
  // fills out the edit form based on its information
  $scope.populate = function() {
    console.log('in editRecipe populate current recipe is:', UserService.userObject.currentRecipe);

    if (UserService.userObject.currentRecipe != undefined) {
      $scope.title = UserService.userObject.currentRecipe.title;

      // formats array of ingredients into view format
      for (var i = 0; i < UserService.userObject.currentRecipe.ingredients.length; i++) {
        var ingredient = {};
        ingredient.id = "I" + (i+1);
        ingredient.name = UserService.userObject.currentRecipe.ingredients[i];
        $scope.ingredientsArray.push(ingredient);
      }
      // formats array of steps into view format
      for (var j = 0; j < UserService.userObject.currentRecipe.steps.length; j++) {
        var step = {};
        step.id = "I" + (j+1);
        step.name = UserService.userObject.currentRecipe.steps[j];
        $scope.stepsArray.push(step);
      }
      $scope.categoryOptions = UserService.userObject.currentRecipe.categories;
      $scope.recipe.image_url = UserService.userObject.currentRecipe.image_url;
    }
  }

  // calling the function that fills out the edit form
  $scope.populate();

  // adds a new ingredient input to the DOM
  $scope.addNewIngredient = function() {
      var newIngredientNo = $scope.ingredientsArray.length+1;
      console.log('Adding new ingredient');
      $scope.ingredientsArray.push({'id':'I' + newIngredientNo});
      console.log('Ingredients Array is now:', $scope.ingredientsArray);
  };

  // removes an ingredient input from the DOM
  $scope.removeIngredient = function(ingredient) {
      console.log('Removing ingredient');
      var ingredientIndex = $scope.ingredientsArray.indexOf(ingredient);
      $scope.ingredientsArray.splice(ingredientIndex,1);
  };

  // adds a step input to the DOM
  $scope.addNewStep = function() {
      var newStepNo = $scope.stepsArray.length+1;
      console.log('Adding new step');
      $scope.stepsArray.push({'id':'I' + newStepNo});
      console.log('Steps Array is now:', $scope.stepsArray);
  };

  // removes a step input from the DOM
  $scope.removeStep = function(step) {
      console.log('Removing step');
      var stepIndex = $scope.stepsArray.indexOf(step);
      $scope.stepsArray.splice(stepIndex,1);
  };

  // function that gathers information entered by the user and calls
  // the factory function to post the recipe
  $scope.editRecipe = function() {
    // initializes arrays in recipe object
    $scope.recipe.ingredients = [];
    $scope.recipe.steps = [];
    $scope.recipe.title = $scope.title;
    $scope.recipe.favorite = UserService.userObject.currentRecipe.favorite;
    $scope.recipe.categories = $scope.categoryOptions;
    $scope.recipe.username = $scope.userObject.userName;
    $scope.recipe._id = UserService.userObject.currentRecipe._id;

    // formats array of ingredients into db schema format
    for (var i = 0; i < $scope.ingredientsArray.length; i++) {
      $scope.recipe.ingredients.push($scope.ingredientsArray[i].name);
    }
    // formats array of steps into db schema format
    for (var j = 0; j < $scope.stepsArray.length; j++) {
      $scope.recipe.steps.push($scope.stepsArray[j].name);
    }

    // assign image_url (from uploaded img insert into the db)
    // if a new image has been selected:
    if (filename) {
      $scope.recipe.image_url = filename;
    } else {
      // keep the image on file
      $scope.recipe.image_url = UserService.userObject.currentRecipe.image_url;;
    }

    console.log('Saving recipe', $scope.recipe);
    RecipeDataService.updateRecipe($scope.recipe);

    UserService.redirect('/user');

  } // end of addRecipe function

  // Upload picture file Section
  $scope.uploadPic = function(file) {
    file.upload = Upload.upload({
      url: '/uploads',
      data: {name: UserService.userObject.userName, file: file},
    });

    file.upload.then(function (response) {
      console.log('0 Back from upload with data:',response.data);
      // saves filename to use when saving recipe
      // filename in localhost:
      // filename = response.data.file.path + "/" + response.data.file.originalname;
      // updated filename that works with aws
      filename = response.data.file.location;
      console.log('URL is:',filename);

      $timeout(function () {
        file.result = response.data;
        console.log('1 Back from upload with data:',response.data);
        // filename in localhost:
        // filename = response.data.file.path + "/" + response.data.file.originalname;
        // updated filename that works with aws
        filename = response.data.file.location;
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
