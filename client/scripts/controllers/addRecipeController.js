myApp.controller('addRecipeController', ['$scope','UserService', function($scope,UserService) {
  $scope.userObject = UserService.userObject;
  $scope.logout = UserService.logout;

}]);
