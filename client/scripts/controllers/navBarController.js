myApp.controller('navBarController', ['UserService', function(UserService) {
    var originatorEv;

    this.openMenu = function($mdMenu, ev) {
      originatorEv = ev;
      $mdMenu.open(ev);
    };
}]);
