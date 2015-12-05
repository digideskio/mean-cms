'use strict';

angular.module('meanCmsApp')
  .controller('appCtrl', function ($scope, $rootScope, authorisation, data) {

    $rootScope.loading = true;
    $rootScope.isAuthed = false;

    $scope.authFailed = false;

    $scope.loadMenu = function () {

      var objectsRes = data.getObjectsMetaData();
      objectsRes.get().$promise.then(function (data) {

        $scope.objectsMetaData = data;

        $scope.$broadcast("objectMetaDataLoaded", $scope.objectsMetaData);
      });
    };

    $scope.init = function () {

      authorisation.getAuthPromise().then(function(success){
        if (success) {
          $scope.loadMenu();
        }
      });
    };

    $scope.login = function () {

      var username = $scope.username,
        password = $scope.password;

      authorisation.authorise(username, password).then(function (rep) {

        var json = rep.data;

        if (json.success === true) {
          $rootScope.isAuthed = true;
          $scope.authFailed = false;

          //clear model for username and password
          $scope.username = "";
          $scope.password = "";

          //load menu
          $scope.loadMenu();

        } else {
          $rootScope.isAuthed = false;
          $scope.authFailed = true;
        }
      });
    }

    $scope.init();

  });
