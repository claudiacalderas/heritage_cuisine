var myApp = angular.module('myApp', ['ngRoute','ngMaterial']);

// Angular Material Theme Configuration
myApp.config(['$mdThemingProvider', function($mdThemingProvider) {
   $mdThemingProvider.theme('altTheme').primaryPalette('grey');
 }]);

/// Routes ///
myApp.config(['$routeProvider', '$locationProvider',
      function($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix('');

  $routeProvider
    .when('/home', {
      templateUrl: '/views/templates/home.html',
      controller: 'LoginController',
    })
    .when('/register', {
      templateUrl: '/views/templates/register.html',
      controller: 'LoginController'
    })
    .when('/user', {
      templateUrl: '/views/templates/user.html',
      controller: 'UserController',
      resolve: {
        getuser : ['UserService', function(UserService){
          return UserService.getuser();
        }]
      }
    })
    .when('/addrecipe', {
      templateUrl: '/views/templates/addRecipe.html',
      controller: 'addRecipeController',
      resolve: {
        getuser : ['UserService', function(UserService){
          return UserService.getuser();
        }]
      }
    })
    .when('/editrecipe', {
      templateUrl: '/views/templates/editRecipe.html',
      controller: 'editRecipeController',
      resolve: {
        getuser : ['UserService', function(UserService){
          return UserService.getuser();
        }]
      }
    })
    .when('/recipe', {
      templateUrl: '/views/templates/recipe.html',
      controller: 'recipeController',
      resolve: {
        getuser : ['UserService', function(UserService){
          return UserService.getuser();
        }]
      }
    })
    .when('/grouplist', {
      templateUrl: '/views/templates/groupList.html',
      controller: 'groupListController',
      resolve: {
        getuser : ['UserService', function(UserService){
          return UserService.getuser();
        }]
      }
    })
    .when('/info', {
      templateUrl: '/views/templates/info.html',
      controller: 'InfoController',
      resolve: {
        getuser : ['UserService', function(UserService){
          return UserService.getuser();
        }]
      }
    })
    .otherwise({
      redirectTo: 'home'
    });
}]);

myApp.controller('addRecipeController', ['$scope', '$location','UserService', 'RecipeDataService',
                                        function($scope, $location, UserService, RecipeDataService) {
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

    UserService.redirect('/user');
    
  } // end of addRecipe function

}]);

myApp.controller('editRecipeController', ['$scope', '$location','UserService', 'RecipeDataService',
                                        function($scope, $location, UserService, RecipeDataService) {
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

  $scope.populate = function() {
    console.log('in editRecipe populate current recipe is:', UserService.userObject.currentRecipe);

    if (UserService.userObject.currentRecipe != undefined) {
      console.log('im in');
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
    }
  }

  $scope.populate();

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

  $scope.editRecipe = function() {
    // initializes arrays in recipe object
    $scope.recipe.ingredients = [];
    $scope.recipe.steps = [];
    $scope.recipe.title = $scope.title;
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

    // temporary image_url until add photo is implemented
    $scope.recipe.image_url = '';

    console.log('Saving recipe', $scope.recipe);
    RecipeDataService.updateRecipe($scope.recipe);

    UserService.redirect('/user');

  } // end of addRecipe function


}]);

myApp.controller('groupListController', ['$scope', 'UserService', function($scope, UserService) {
  $scope.userObject = UserService.userObject;
  $scope.logout = UserService.logout;

}]);

myApp.controller('InfoController', ['$scope', '$http', '$location', 'UserService', function($scope, $http, $location, UserService) {
  $scope.logout = UserService.logout;
}]);

myApp.controller('LoginController', ['$scope', '$http', '$location', 'UserService', function($scope, $http, $location, UserService) {
    $scope.user = {
      username: '',
      password: ''
    };
    $scope.message = '';

    $scope.login = function() {
      if($scope.user.username === '' || $scope.user.password === '') {
        $scope.message = "Enter your username and password!";
      } else {
        console.log('sending to server...', $scope.user);
        $http.post('/', $scope.user).then(function(response) {
          if(response.data.username) {
            UserService.userObject.userName = response.data.username;
            console.log('success: ', response.data);
            // location works with SPA (ng-route)
            $location.path('/user');
          } else {
            console.log('failure: ', response);
            $scope.message = "Invalid combination of username and password.";
          }
        });
      }
    };

    $scope.registerUser = function() {
      if($scope.user.username === '' || $scope.user.password === '') {
        $scope.message = "Choose a username and password!";
      } else {
        console.log('sending to server...', $scope.user);
        $http.post('/register', $scope.user).then(function(response) {
          console.log('success');
          $location.path('/home');
        },
        function(response) {
          console.log('error');
          $scope.message = "Please try again."
        });
      }
    }
}]);

myApp.controller('navBarController', ['$scope', '$location','UserService', function($scope, $location, UserService) {
    var originatorEv;
    $scope.redirect = UserService.redirect;


    $scope.openMenu = function($mdMenu, ev) {
      originatorEv = ev;
      $mdMenu.open(ev);
    };

}]);

myApp.controller('recipeController', ['$scope', '$location','UserService', 'RecipeDataService',
                                        function($scope, $location, UserService, RecipeDataService) {
  $scope.userObject = UserService.userObject;
  $scope.logout = UserService.logout;
  $scope.recipe = UserService.userObject.currentRecipe;


  console.log('recipeController loaded');
  console.log('current recipe is:', $scope.recipe);
  console.log('current user is:', UserService.userObject.userName);


  $scope.editRecipe = function(recipe) {
    console.log('edit recipe clicked',recipe);
    UserService.userObject.currentRecipe = recipe;
    UserService.redirect('/editrecipe');
  }

}]);

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
    $scope.userObject.currentRecipe = recipe;
    UserService.redirect('/recipe');
  }

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

  $scope.toggleFavorite() {

  }

}]);

myApp.factory('RecipeDataService', ['$http', '$location', function($http, $location){

  console.log('Recipe Data Service Loaded');

  var recipesObject = {
    allRecipes: []
  };

  getRecipes = function(user){
    var username = angular.copy(user);
    console.log('in getRecipes with user', username);

    $http.get('/recipe/' + username).then(function(response) {
      console.log('Back from the server with:', response);
      recipesObject.allRecipes = response.data;
      console.log('Updated recipesObject:', recipesObject.allRecipes);
    });
  };

  postRecipe = function(recipe) {
    var recipeToPost = angular.copy(recipe);
    var username = recipeToPost.username;
    console.log('Posting recipe: ', recipeToPost);
    $http.post('/recipe/add', recipeToPost).then(function(response) {
      getRecipes(username);
    });
  };

  updateRecipe = function(recipe) {
    var recipeToUpdate = angular.copy(recipe);
    var username = recipeToUpdate.username;
    console.log('Updating recipe: ', recipeToUpdate);
    $http.put('/recipe/update', recipeToUpdate).then(function(response) {
      getRecipes(username);
    });
  };

  deleteRecipe = function(recipe) {
    console.log('Deleting recipe: ',recipe);
    var username = recipe.username;
    $http.delete('/recipe/delete/' + recipe._id).then(function(response) {
      getRecipes(username);
    });
  }

  return {
    recipesObject : recipesObject,
    getRecipes : getRecipes,
    postRecipe : postRecipe,
    updateRecipe : updateRecipe,
    deleteRecipe : deleteRecipe
  };

}]);

myApp.factory('UserService', ['$http', '$location', function($http, $location){
  console.log('User Service Loaded');

  var userObject = {};

  var redirect = function(page){
    console.log('inpage navigation', page);
    $location.url(page);
  }

  return {
    userObject : userObject,
    redirect : redirect,

    getuser : function(){
      $http.get('/user').then(function(response) {
        console.log('STEP 1: assign username');
          if(response.data.username) {
              // user has a curret session on the server
              userObject.userName = response.data.username;
              console.log('User Data: ', userObject.userName);
          } else {
              // user has no session, bounce them back to the login page
              $location.path("/home");
          }
      });
    },

    logout : function() {
        $http.get('/user/logout').then(function(response) {
          console.log('logged out');
          $location.path("/home");
        });
    }
  };
}]);
