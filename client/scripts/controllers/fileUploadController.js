myApp.controller('FileUploadController', ['$scope', '$location','$mdDialog','$http','Upload','$timeout','UserService','GroupDataService','RecipeDataService',
                                        function($scope, $location, $mdDialog, $http, Upload, $timeout, UserService, GroupDataService, RecipeDataService) {
  $scope.userObject = UserService.userObject;
  $scope.logout = UserService.logout;
  $scope.recipe = UserService.userObject.currentRecipe;
  $scope.groups = {};
  $scope.uploads = [];

  console.log('FileUploadController loaded');
  console.log('current recipe is:', $scope.recipe);
  console.log('current user is:', UserService.userObject.userName);


  $scope.uploadPic = function(file) {
  file.upload = Upload.upload({
    url: '/uploads',
    data: {name: UserService.userObject.userName, file: file},
  });

  file.upload.then(function (response) {
    $timeout(function () {
      file.result = response.data;
    });
    }, function (response) {
      if (response.status > 0)
        $scope.errorMsg = response.status + ': ' + response.data;
    }, function (evt) {
      // Math.min is to fix IE which reports 200% sometimes
      file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    });
  }


  $http.get('/uploads').then(function(response){
    console.log(response.data);
    $scope.uploads = response.data;
  });



}]);
