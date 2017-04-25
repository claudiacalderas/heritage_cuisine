myApp.controller('navBarController', ['$scope', '$location','UserService', function($scope, $location, UserService) {
    var originatorEv;

    $scope.openMenu = function($mdMenu, ev) {
      originatorEv = ev;
      $mdMenu.open(ev);
    };

    $scope.redirect = function(page){
      console.log('nav clicked', page);
      $location.url(page);
    }

}]);
