var myApp = angular.module('myApp', ['ngRoute','ngMaterial','ngFileUpload']);

// Angular Material Theme Configuration
myApp.config(['$mdThemingProvider', function($mdThemingProvider) {
   $mdThemingProvider.theme('altTheme').primaryPalette('grey').accentPalette('blue-grey');
}]);

/// Routes ///
myApp.config(['$routeProvider', '$locationProvider',
      function($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix('');

  $routeProvider
    // Login View
    .when('/home', {
      templateUrl: '/views/templates/home.html',
      controller: 'LoginController',
    })
    // Register new user View
    .when('/register', {
      templateUrl: '/views/templates/register.html',
      controller: 'LoginController'
    })
    // Main View of the app
    .when('/user', {
      templateUrl: '/views/templates/user.html',
      controller: 'UserController',
      resolve: {
        getuser : ['UserService', function(UserService){
          return UserService.getuser();
        }]
      }
    })
    // Add Recipe View
    .when('/addrecipe', {
      templateUrl: '/views/templates/addRecipe.html',
      controller: 'addRecipeController',
      resolve: {
        getuser : ['UserService', function(UserService){
          return UserService.getuser();
        }]
      }
    })
    // Edit Recipe View
    .when('/editrecipe', {
      templateUrl: '/views/templates/editRecipe.html',
      controller: 'editRecipeController',
      resolve: {
        getuser : ['UserService', function(UserService){
          return UserService.getuser();
        }]
      }
    })
    // Display Recipe View
    .when('/recipe', {
      templateUrl: '/views/templates/recipe.html',
      controller: 'recipeController',
      resolve: {
        getuser : ['UserService', function(UserService){
          return UserService.getuser();
        }]
      }
    })
    // Group List View
    .when('/grouplist', {
      templateUrl: '/views/templates/groupList.html',
      controller: 'groupListController',
      resolve: {
        getuser : ['UserService', function(UserService){
          return UserService.getuser();
        }]
      }
    })
    // Update Group View (add/remove users to group)
    .when('/updategroup', {
      templateUrl: '/views/templates/updateGroup.html',
      controller: 'updateGroupController',
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
  // default category options showed to the user, these can be deleted on the DOM
  $scope.categoryOptions = ['Dessert', 'Appetizer', 'Dinner'];
  // filename stores the picture filename assigned by the uploadPic function
  var filename;

  // adds a new ingredient input to the DOM
  $scope.addNewIngredient = function() {
      var newIngredientNo = $scope.ingredientsArray.length+1;
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
      filename = "https://s3.amazonaws.com/" + response.data.file.bucket + "/" + response.data.created;
      //+ "/" + response.data.file.originalname
      console.log('URL is:',filename);

      $timeout(function () {
        file.result = response.data;
        console.log('1 Back from upload with data:',response.data);
        // filename in localhost:
        // filename = response.data.file.path + "/" + response.data.file.originalname;
        // updated filename that works with aws
        filename = "https://s3.amazonaws.com/" + response.data.file.bucket + "/" + response.data.created;
        //+ "/" + response.data.file.originalname
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

myApp.controller('groupListController', ['$scope', '$mdDialog', 'UserService', 'GroupDataService', function($scope, $mdDialog, UserService, GroupDataService) {
  $scope.userObject = UserService.userObject;
  $scope.logout = UserService.logout;
  $scope.groupsObject = GroupDataService.groupsObject;
  $scope.redirect = UserService.redirect;

  // calls factory function to get groups for current user
  console.log('user in grouplist scope: ', $scope.userObject.userName);
  GroupDataService.getGroups($scope.userObject.userName);

  // redirects to view that shows group detailed information
  $scope.viewGroup = function(group) {
    UserService.userObject.currentGroup = group;
    UserService.redirect('/updategroup');
  };

  // modal window that prompts for the new group name
  $scope.showPrompt = function(ev) {
    var confirm = $mdDialog.prompt()
      .title('Please Provide a name for your new group')
      .textContent('')
      .placeholder('Group name')
      .ariaLabel('Group name')
      .initialValue('')
      .targetEvent(ev)
      .ok('Create')
      .cancel('Cancel');
    $mdDialog.show(confirm).then(function(result) {
      // calls factory function to create a new group
      GroupDataService.newGroup(result, UserService.userObject.userName);
    }, function() {
      console.log('Group creation cancelled');
    });
  };

  // removes user from selected group
  $scope.leave = function(group) {
    console.log('leave group button clicked');
    console.log('group is', group);
    var index = group.users.indexOf(UserService.userObject.userName);
    group.users.splice(index);
    console.log('new group is', group);
    GroupDataService.updateGroup(group,UserService.userObject.userName);
  };

  // modal window that confirms group deletion
  $scope.showConfirm = function(ev,group) {
    var confirm = $mdDialog.confirm()
          .title('Would you like to delete this group?')
          .textContent('')
          .ariaLabel('Delete group')
          .targetEvent(ev)
          .ok('Delete')
          .cancel('Cancel');
    $mdDialog.show(confirm).then(function() {
      GroupDataService.deleteGroup(group);
      }, function() {
      console.log('Deletion cancelled');
    });
  };

}]);

myApp.controller('LoginController', ['$scope', '$http', '$location', 'UserService', function($scope, $http, $location, UserService) {
  $scope.user = {
    username: '',
    password: ''
  };
  $scope.message = '';

  // logs a user into the system
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

  // registers a new user
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
  };
}]);

myApp.controller('navBarController', ['$scope', '$location','UserService', function($scope, $location, UserService) {
  var originatorEv;
  $scope.redirect = UserService.redirect;

  // Displays menu options
  $scope.openMenu = function($mdMenu, ev) {
    originatorEv = ev;
    $mdMenu.open(ev);
  };

}]);

myApp.controller('recipeController', ['$scope', '$location','$mdDialog','$http', 'UserService', 'GroupDataService', 'RecipeDataService',
                                        function($scope, $location, $mdDialog, $http, UserService, GroupDataService, RecipeDataService) {
  $scope.userObject = UserService.userObject;
  $scope.logout = UserService.logout;
  $scope.recipe = UserService.userObject.currentRecipe;
  $scope.groups = {};
  $scope.customFullscreen = false;
  $scope.modalSelection;

  console.log('recipeController loaded');
  console.log('current recipe is:', $scope.recipe);
  console.log('current user is:', UserService.userObject.userName);

  // loads user's groups in case user shares recipe
  GroupDataService.getGroups(UserService.userObject.userName);
  $scope.groups = GroupDataService.groupsObject;
  console.log('GROUPS LOADED:',$scope.groups);

  // Redirects to Edit Recipe view
  $scope.editRecipe = function(recipe) {
    console.log('edit recipe clicked',recipe);
    UserService.userObject.currentRecipe = recipe;
    UserService.redirect('/editrecipe');
  };

  // Controls functionality of modal window for group selecting (share recipe)
  function DialogController($scope, $mdDialog, dataItems) {
    var dialogCtrl = this;
    dialogCtrl.items = dataItems;
    console.log('IN DialogController ITEMS ARE:', dialogCtrl.items);
    dialogCtrl.saveAndClose = function() {
      $mdDialog.hide({
        'selectedItems': dialogCtrl.items.filter(function(item) {
          return item.selected;
        })
      });
    }
    dialogCtrl.cancel = function() {
      $mdDialog.cancel();
    };
  };

  // alert showing that user is already in group. Called from addUserToGroup
  $scope.showAlert = function() {
    $mdDialog.show(
      $mdDialog.alert()
        .clickOutsideToClose(true)
        .title('This recipe has been shared with the group(s)')
        .ariaLabel('Alert: Recipe has been shared with the group')
        .ok('Ok')
    );
  };

  // shows modal window for group selecting (share recipe)
  $scope.shareRecipe = function(ev,recipe) {
      console.log('IN SHARE RECIPE');
      console.log('user in recipeController scope: ', $scope.userObject.userName);
      console.log('GROUPS ARE:', $scope.groups.allGroups);

      $mdDialog.show({
        controller: DialogController,
        controllerAs: 'dialogCtrl',
        templateUrl: 'views/templates/shareRecipe.html',
        locals: {
          dataItems: $scope.groups.allGroups
        },
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      })
      .then(function(response) {
        $scope.selectedValue = response;
        $scope.modalSelection = angular.copy($scope.selectedValue);
        var formattedArray = formatShareArray($scope.modalSelection.selectedItems, UserService.userObject.currentRecipe)
        console.log('FORMATTEDARRAY:', formattedArray);
        // Calls function that shares current recipe with the groups selected
        RecipeDataService.shareRecipeWithGroups(formattedArray, $scope.userObject.userName);
        // Informs user that recipe has been shared
        $scope.showAlert();
        // Cleans selection
        $scope.selectedValue = [];
      }, function() {
        console.log('Share Dialog cancelled');
        $scope.selectedValue = [];
      });
    };

    // Creates an array in the format expected by the database with the recipe/user information
    // for Recipe Sharing
    function formatShareArray(groupsSelected,recipe) {
      var arrayToPost = [];
      console.log('groupsSelected', groupsSelected);
      for (var i = 0; i < groupsSelected.length; i++) {
        console.log('groupsSelected[i].users',groupsSelected[i].users);
        for (var j = 0; j < groupsSelected[i].users.length; j++) {
          if(groupsSelected[i].users[j] != $scope.userObject.userName) {
            var recipeDocument = {};
            recipeDocument.username = groupsSelected[i].users[j];
            recipeDocument.image_url = recipe.image_url;
            recipeDocument.title = recipe.title;
            recipeDocument.steps = recipe.steps;
            recipeDocument.favorite = recipe.favorite;
            recipeDocument.ingredients = recipe.ingredients;
            recipeDocument.categories = recipe.categories;
            arrayToPost.push(recipeDocument);
          }
        }
      }
      console.log('FINAL RESULT ARRAY:',arrayToPost);
      return arrayToPost;
    };

}]);

myApp.controller('updateGroupController', ['$scope', '$log', '$http', '$mdDialog', 'UserService', 'GroupDataService', function($scope, $log, $http, $mdDialog, UserService, GroupDataService) {
  $scope.userObject = UserService.userObject;
  $scope.logout = UserService.logout;
  $scope.groupsObject = GroupDataService.groupsObject;
  $scope.redirect = UserService.redirect;
  $scope.group = UserService.userObject.currentGroup;
  $scope.visible = false;
  $scope.addVisible = false;
  $scope.repos;
  $scope.simulateQuery = false;
  $scope.isDisabled = false;
  $scope.userSearch;
  $scope.selectedItemChange;
  $scope.searchTextChange;
  $scope.arrayOfUsers;
  $scope.userToAdd;

  console.log('updateGroupController loaded');
  console.log('current group is:', $scope.group);
  console.log('current user is:', UserService.userObject.userName);

  // Loads autocomplete element to search for users
  $scope.makeAddUsersVisible = function() {
    // directly getting info from the controller to avoid problems getting data due
    // to asynchronous execution of functions
    $http.get('/group/users/' + UserService.userObject.userName).then(function(response) {
      console.log('Back from the server with:', response);
      $scope.arrayOfUsers = response.data;
      $scope.repos = loadAll();
      $scope.simulateQuery = false;
      $scope.isDisabled    = false;
      $scope.userSearch = userSearch;
      $scope.selectedItemChange = selectedItemChange;
      $scope.searchTextChange = searchTextChange;
      $scope.visible = true;
    });
  };

  // function used by autocomplete element to serch within users
  function userSearch (query) {
    var results = query ? $scope.repos.filter( createFilterFor(query) ) : $scope.repos, deferred;
    return results;
  };

  // Logs user data entry
  function searchTextChange(text) {
    $scope.addVisible = false;
    $log.info('Text changed to ' + text);
  };

  // If a user has been selected, saves the username and makes add button visible
  function selectedItemChange(item) {
    $log.info('Item changed to ' + JSON.stringify(item));
    $scope.userToAdd = item;
    $scope.addVisible = true;
  };

  // load results of query in autocomplete element
  function loadAll() {
    var repos = $scope.arrayOfUsers;
    console.log('in loadAll allUsers',$scope.arrayOfUsers);
    console.log('in loadAll repos',repos);
    return repos.map( function (repo) {
      repo.value = repo.name.toLowerCase();
      return repo;
    });
  };

  // Create filter function for a query string
  function createFilterFor(query) {
    var lowercaseQuery = angular.lowercase(query);
    return function filterFn(item) {
      return (item.value.indexOf(lowercaseQuery) === 0);
    };
  };

  // alert showing that user is already in group. Called from addUserToGroup
  $scope.showAlert = function(message) {
    $mdDialog.show(
      $mdDialog.alert()
        .clickOutsideToClose(true)
        .title(message)
        .ariaLabel(message)
        .ok('Ok')
    );
  };

  // Updates the array that holds users in the group
  $scope.addUserToGroup = function() {
    console.log('addUserToGroup button clicked user is:', $scope.userToAdd.username);
    var inGroup = false;
    for (var i = 0; i < $scope.group.users.length; i++) {
      if ($scope.userToAdd.username === $scope.group.users[i]) {
        inGroup = true;
      }
    };
    if (!inGroup) {
      $scope.group.users.push($scope.userToAdd.username);
    } else {
      // show alert message - user already in group
      $scope.showAlert('This user is already in the group');
      inGroup = false;
    }
  };

  // confirms that admin stays in group (in case user has deleted it)
  function confirmsAdminInGroup() {
    var adminInGroup = false;
    for (var i = 0; i < $scope.group.users.length; i++) {
      if ($scope.group.user_admin === $scope.group.users[i]) {
        adminInGroup = true;
      }
    };
    // Adds admin if it is not in the group and shows alert to user
    if (!adminInGroup) {
      $scope.group.users.unshift($scope.group.user_admin);
      $scope.showAlert('The group administrator cannot be deleted from the group');
    }
  };

  // Calls function in the factory that updates group's users information
  $scope.update = function() {
    console.log('updateGroup button clicked',$scope.group);
    confirmsAdminInGroup();
    // calls factory function to update group in the database
    GroupDataService.updateGroup($scope.group,UserService.userObject.userName);
    UserService.redirect('/grouplist');
  };

}]);

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

myApp.factory('GroupDataService', ['$http', '$location', function($http, $location){

  console.log('Recipe Data Service Loaded');

  // Stores all groups associated with the logged user
  var groupsObject = {
    allGroups: []
  };

  // Gets all groups related to the specified user
  getGroups = function(user){
    var username = angular.copy(user);
    console.log('in getGroups with user', username);
    $http.get('/group/' + username).then(function(response) {
      console.log('Back from the server with:', response);
      groupsObject.allGroups = response.data;
      console.log('Updated groupsObject:', groupsObject.allGroups);
    });
  };

  // Adds a new group assigning the specified user as the admin
  newGroup = function(group, user) {
    var name = angular.copy(group);
    var username = angular.copy(user);
    var groupToPost = {};
    groupToPost.group_name = name;
    groupToPost.user_admin = username;
    groupToPost.users = [];
    groupToPost.users.push(username);
    console.log('Creating group: ', groupToPost);
    $http.post('/group/add', groupToPost).then(function(response) {
      console.log('Back from server after creating group:', response);
      getGroups(username);
    });
  };

  // Updates users in group
  updateGroup = function(group, user) {
    var groupToUpdate = angular.copy(group);
    var username = angular.copy(user);
    console.log('Updating group:', group);
    $http.put('/group/update', group).then(function(response) {
      console.log('Group updated succesfully');
      getGroups(username)
    });
  };

  // Deletes a group
  deleteGroup = function(group) {
    console.log('Deleting group: ',group);
    var username = group.user_admin;
    $http.delete('/group/delete/' + group._id).then(function(response) {
      getGroups(username);
    });
  };

  return {
    groupsObject : groupsObject,
    newGroup : newGroup,
    getGroups : getGroups,
    updateGroup : updateGroup,
    deleteGroup : deleteGroup
  };

}]);

myApp.factory('RecipeDataService', ['$http', '$location', function($http, $location){

  console.log('Recipe Data Service Loaded');

  // Stores all recipes associated with the logged user
  var recipesObject = {
    allRecipes: []
  };

  // Gets all recipes in the database for a specific uset
  getRecipes = function(user){
    var username = angular.copy(user);
    console.log('in getRecipes with user', username);
    $http.get('/recipe/' + username).then(function(response) {
      console.log('Back from the server with:', response);
      recipesObject.allRecipes = response.data;
      console.log('Updated recipesObject:', recipesObject.allRecipes);
    });
  };

  // Searches recipes based on a specific user and by recipe name
  searchRecipes = function(user,searchString){
    var username = angular.copy(user);
    console.log('in searchRecipes with user', username);
    console.log('in searchRecipes searchString is', searchString);
    $http.get('/recipe/search/' + username + '/' + searchString).then(function(response) {
      console.log('Back from the server with:', response);
      recipesObject.allRecipes = response.data;
      console.log('Updated recipesObject:', recipesObject.allRecipes);
    });
  };

  // Posts a new recipe to the database
  postRecipe = function(recipe) {
    var recipeToPost = angular.copy(recipe);
    var username = recipeToPost.username;
    console.log('Posting recipe: ', recipeToPost);
    $http.post('/recipe/add', recipeToPost).then(function(response) {
      getRecipes(username);
    });
  };

  // Updates a specific recipe
  updateRecipe = function(recipe) {
    var recipeToUpdate = angular.copy(recipe);
    var username = recipeToUpdate.username;
    console.log('Updating recipe: ', recipeToUpdate);
    $http.put('/recipe/update', recipeToUpdate).then(function(response) {
      getRecipes(username);
    });
  };

  // Deletes a specific recipe
  deleteRecipe = function(recipe) {
    console.log('Deleting recipe: ',recipe);
    var username = recipe.username;
    $http.delete('/recipe/delete/' + recipe._id).then(function(response) {
      getRecipes(username);
    });
  };

  // Shares a recipe with selected users. Receives an array with the documents
  // that will be inserted in the recipes collection
  shareRecipeWithGroups = function(arrayToPost, user) {
    console.log('Sharing recipes: ', arrayToPost);
    $http.post('/recipe/share', arrayToPost).then(function(response) {
      console.log('In shareRecipeWithGroups back from the server',response);
    });
  };

  return {
    recipesObject : recipesObject,
    getRecipes : getRecipes,
    postRecipe : postRecipe,
    updateRecipe : updateRecipe,
    deleteRecipe : deleteRecipe,
    shareRecipeWithGroups : shareRecipeWithGroups,
    searchRecipes : searchRecipes
  };

}]);

myApp.factory('UserService', ['$http', '$location', function($http, $location){
  console.log('User Service Loaded');

  // Stores logged user information (username, current recipe, current group)
  var userObject = {};

  // Redirects to view received as a parameter
  function redirect(page) {
    console.log('inpage navigation', page);
    $location.url(page);
  }

  return {
    userObject : userObject,
    redirect : redirect,
    // Gets logged user
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
    // Logs out the user
    logout : function() {
      $http.get('/user/logout').then(function(response) {
        console.log('logged out');
        $location.path("/home");
      });
    }
  };
}]);
