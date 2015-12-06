'use strict';

angular.module('meanCmsApp')
  .controller('editCtrl', function ($scope, $routeParams, $rootScope, data, $location) {

    $scope.loadObjectMetaData = function(){

      $scope.$on("objectMetaDataLoaded", function(ev, objectsMetaData){

        $scope.objectMetaData = objectsMetaData[$routeParams.objectName];
      });

      if (typeof $scope.objectsMetaData === "object" && typeof $scope.objectMetaData === "undefined"){

        $scope.objectMetaData = $scope.objectsMetaData[$routeParams.objectName];
      }
    };

    $scope.loadObject = function(){

      var objectId = $routeParams.id,
        Object = data.getObject($routeParams.objectName);

      Object.get({ id : objectId}).$promise.then(function(response){

        $scope.object = response;
      });
    };

    $scope.init = function(){

      $scope.loadObjectMetaData();
      $scope.loadObject();

      $scope.$on("instanceSave", function(ev, values){

        var Object = data.getObject($routeParams.objectName),
          object = new Object(values);

        object.$update({id : values[$scope.objectMetaData.table.idFieldName]}).then(function(response){

          $location.path("/objects/" + $routeParams.objectName + "/list");
        });
      });
    };

    $scope.init();
  });
