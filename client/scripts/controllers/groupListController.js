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
