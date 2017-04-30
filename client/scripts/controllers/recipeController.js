myApp.controller('recipeController', ['$scope', '$location','$mdDialog','$http', 'UserService', 'GroupDataService', 'RecipeDataService',
                                        function($scope, $location, $mdDialog, $http, UserService, GroupDataService, RecipeDataService) {
  $scope.userObject = UserService.userObject;
  $scope.logout = UserService.logout;
  $scope.recipe = UserService.userObject.currentRecipe;
  $scope.groups = {};
  $scope.customFullscreen = false;

  console.log('recipeController loaded');
  console.log('current recipe is:', $scope.recipe);
  console.log('current user is:', UserService.userObject.userName);
  GroupDataService.getGroups(UserService.userObject.userName);
  $scope.groups = GroupDataService.groupsObject;
  console.log('GROUPS LOADED (JUST IN CASE)',$scope.groups);

  // Changes view to edit Recipe view
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

    dialogCtrl.hide = function() {
      $mdDialog.hide();
    };

    dialogCtrl.cancel = function() {
      $mdDialog.cancel();
    };

    dialogCtrl.answer = function(answer) {
      $mdDialog.hide(answer);
    };
  };

  $scope.selected = [];

  $scope.toggle = function (item, list) {
    var idx = list.indexOf(item);
    if (idx > -1) {
      list.splice(idx, 1);
    }
    else {
      list.push(item);
    }
  };

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
        $scope.selectedValue = JSON.stringify(response);
        // $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
        console.log('Share Dialog cancelled');
        $scope.selectedValue = 'promise from mdDialog rejected';
      });
    };


}]);
