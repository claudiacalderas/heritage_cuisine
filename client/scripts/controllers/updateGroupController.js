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

  // loads autocomplete element to search for users
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
  }

  // function used by autocomplete element to serch within users
  function userSearch (query) {
    var results = query ? $scope.repos.filter( createFilterFor(query) ) : $scope.repos, deferred;
    return results;
  }

  // logs user data entry
  function searchTextChange(text) {
    $scope.addVisible = false;
    $log.info('Text changed to ' + text);
  }

  function selectedItemChange(item) {
    $log.info('Item changed to ' + JSON.stringify(item));
    $scope.userToAdd = item;
    $scope.addVisible = true;
  }

  // load results of query in autocomplete element
  function loadAll() {
    var repos = $scope.arrayOfUsers;
    console.log('in loadAll allUsers',$scope.arrayOfUsers);
    console.log('in loadAll repos',repos);
    return repos.map( function (repo) {
      repo.value = repo.name.toLowerCase();
      return repo;
    });
  }

  // Create filter function for a query string
  function createFilterFor(query) {
    var lowercaseQuery = angular.lowercase(query);
    return function filterFn(item) {
      return (item.value.indexOf(lowercaseQuery) === 0);
    };
  }

  // alert showing that user is already in group. Called from addUserToGroup
  $scope.showAlert = function() {
    $mdDialog.show(
      $mdDialog.alert()
        .clickOutsideToClose(true)
        .title('This user is already in the group')
        .ariaLabel('Alert User already in Group')
        .ok('Ok')
    );
  };

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
      $scope.showAlert();
      inGroup = false;
    }
  }

  $scope.update = function() {
    console.log('updateGroup button clicked',$scope.group);
    // calls factory function to update group in the database
    GroupDataService.updateGroup($scope.group,UserService.userObject.userName);
    UserService.redirect('/grouplist');
  }

  $scope.error = function() {
    console.log("error");
  }

}]);
