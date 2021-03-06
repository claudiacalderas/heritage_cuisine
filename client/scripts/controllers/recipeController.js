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
