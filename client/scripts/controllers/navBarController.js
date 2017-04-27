myApp.controller('navBarController', ['$scope', '$location','UserService', function($scope, $location, UserService) {
    var originatorEv;
    $scope.redirect = UserService.redirect;


    $scope.openMenu = function($mdMenu, ev) {
      originatorEv = ev;
      $mdMenu.open(ev);
    };

}]);
