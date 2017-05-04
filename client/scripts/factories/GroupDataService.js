myApp.factory('GroupDataService', ['$http', '$location', function($http, $location){

  console.log('Recipe Data Service Loaded');

  // Stores all groups associated with the logged user
  var groupsObject = {
    allGroups: []
  };

  // Gets all groups related to the specified user
  getGroups = function(user){
    var username = angular.copy(user);
    console.log('in getGroups with user', username);
    $http.get('/group/' + username).then(function(response) {
      console.log('Back from the server with:', response);
      groupsObject.allGroups = response.data;
      console.log('Updated groupsObject:', groupsObject.allGroups);
    });
  };

  // Adds a new group assigning the specified user as the admin
  newGroup = function(group, user) {
    var name = angular.copy(group);
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

  // Updates users in group
  updateGroup = function(group, user) {
    var groupToUpdate = angular.copy(group);
    var username = angular.copy(user);
    console.log('Updating group:', group);
    $http.put('/group/update', group).then(function(response) {
      console.log('Group updated succesfully');
      getGroups(username)
    });
  };

  // Deletes a group
  deleteGroup = function(group) {
    console.log('Deleting group: ',group);
    var username = group.user_admin;
    $http.delete('/group/delete/' + group._id).then(function(response) {
      getGroups(username);
    });
  };

  return {
    groupsObject : groupsObject,
    newGroup : newGroup,
    getGroups : getGroups,
    updateGroup : updateGroup,
    deleteGroup : deleteGroup
  };

}]);
