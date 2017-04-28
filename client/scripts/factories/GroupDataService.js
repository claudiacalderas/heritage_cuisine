myApp.factory('GroupDataService', ['$http', '$location', function($http, $location){

  console.log('Recipe Data Service Loaded');

  var groupsObject = {
    allGroups: []
  };

  getGroups = function(user){
    var username = angular.copy(user);
    console.log('in getGroups with user', username);
    $http.get('/group/' + username).then(function(response) {
      console.log('Back from the server with:', response);
      groupsObject.allGroups = response.data;
      console.log('Updated groupsObject:', groupsObject.allGroups);
    });
  };

  newGroup = function(groupName, user) {
    var name = angular.copy(groupName);
    var username = angular.copy(user);
    var groupToPost = {};
    groupToPost.group_name = name;
    groupToPost.user_admin = username;
    groupToPost.users = [];
    groupToPost.users.push(username);
    console.log('Creating group: ', groupToPost);
    $http.post('/group/add', groupToPost).then(function(response) {
      console.log('Back from server after creating group:', response);
      getGroups(username);
    });
  };

  // updateRecipe = function(recipe) {
  //   var recipeToUpdate = angular.copy(recipe);
  //   var username = recipeToUpdate.username;
  //   console.log('Updating recipe: ', recipeToUpdate);
  //   $http.put('/recipe/update', recipeToUpdate).then(function(response) {
  //     getRecipes(username);
  //   });
  // };
  //
  // deleteRecipe = function(recipe) {
  //   console.log('Deleting recipe: ',recipe);
  //   var username = recipe.username;
  //   $http.delete('/recipe/delete/' + recipe._id).then(function(response) {
  //     getRecipes(username);
  //   });
  // }

  return {
    groupsObject : groupsObject,
    newGroup : newGroup,
    getGroups : getGroups
    // updateRecipe : updateRecipe,
    // deleteRecipe : deleteRecipe
  };

}]);
