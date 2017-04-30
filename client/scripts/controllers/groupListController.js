myApp.controller('groupListController', ['$scope', '$mdDialog', 'UserService', 'GroupDataService', function($scope, $mdDialog, UserService, GroupDataService) {
  $scope.userObject = UserService.userObject;
  $scope.logout = UserService.logout;
  $scope.groupsObject = GroupDataService.groupsObject;
  $scope.redirect = UserService.redirect;

  // calls factory function to get groups for current user
  console.log('user in grouplist scope: ', $scope.userObject.userName);
  GroupDataService.getGroups($scope.userObject.userName);

  $scope.viewGroup = function(group) {
    console.log('view group clicked',group);
    UserService.userObject.currentGroup = group;
    // GroupDataService.getUsers($scope.userObject.userName);
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

  $scope.leave = function() {
    console.log('leave group button clicked');
  };

  // modal window that confirms recipe deletion
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
