myApp.factory('UserService', ['$http', '$location', function($http, $location){
  console.log('User Service Loaded');

  var userObject = {};

  var redirect = function(page){
    console.log('nav clicked', page);
    $location.url(page);
  }

  return {
    userObject : userObject,
    redirect: redirect,

    getuser : function(){
      $http.get('/user').then(function(response) {
        console.log('STEP 1: assign username');
          if(response.data.username) {
              // user has a curret session on the server
              userObject.userName = response.data.username;
              console.log('User Data: ', userObject.userName);
          } else {
              // user has no session, bounce them back to the login page
              $location.path("/home");
          }
      });
    },

    logout : function() {
        $http.get('/user/logout').then(function(response) {
          console.log('logged out');
          $location.path("/home");
        });
    }
  };
}]);
