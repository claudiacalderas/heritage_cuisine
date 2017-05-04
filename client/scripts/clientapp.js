var myApp = angular.module('myApp', ['ngRoute','ngMaterial','ngFileUpload']);

// Angular Material Theme Configuration
myApp.config(['$mdThemingProvider', function($mdThemingProvider) {
   $mdThemingProvider.theme('altTheme').primaryPalette('grey').accentPalette('blue-grey');
  // $mdThemingProvider.disableTheming();
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
