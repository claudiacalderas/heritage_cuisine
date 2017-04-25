myApp.controller('groupListController', ['$scope', 'UserService', function($scope, UserService) {
  $scope.userObject = UserService.userObject;
  $scope.logout = UserService.logout;

}]);
