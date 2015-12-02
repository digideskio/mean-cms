'use strict';

angular.module('meanCmsApp')
  .controller('appCtrl', function ($scope, $rootScope, authorisation) {

    $rootScope.loading = true;
    $rootScope.isAuthed = false;

    $scope.authFailed = false;

    $scope.login = function(){

      var username = $scope.username,
        password = $scope.password;

      authorisation.authorise(username, password).then(function(rep){

        var json = rep.data;

        if (json.success === true){
          $rootScope.isAuthed = true;
          $scope.authFailed = false;

          //clear model for username and password
          $scope.username = "";
          $scope.password = "";

        } else {
          $rootScope.isAuthed = false;
          $scope.authFailed = true;
        }
      });
    }
  });
