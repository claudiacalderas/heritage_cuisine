myApp.controller('groupListController', ['$scope', '$mdDialog', 'UserService', 'GroupDataService', function($scope, $mdDialog, UserService, GroupDataService) {
  $scope.userObject = UserService.userObject;
  $scope.logout = UserService.logout;
  $scope.groupsObject = GroupDataService.groupsObject;
  $scope.redirect = UserService.redirect;

  // calls factory function to get groups for current user
  GroupDataService.getGroups($scope.userObject.userName);

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

}]);
