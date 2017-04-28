myApp.controller('groupListController', ['$scope', '$mdDialog', 'UserService', function($scope, $mdDialog, UserService) {
  $scope.userObject = UserService.userObject;
  $scope.logout = UserService.logout;

  $scope.newGroup = function() {
    console.log('New Group clicked');
  }

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
        console.log('Group will be named:', result);
      }, function() {
        console.log('Group creation cancelled');
      });
    };

}]);
