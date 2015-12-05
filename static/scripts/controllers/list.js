'use strict';

angular.module('meanCmsApp')
  .controller('listCtrl', function ($scope, $routeParams, $rootScope, data) {

    $scope.listObjects = function(){

      var objectName = $routeParams.objectName,
        objectsRes = data.getObject(objectName);
      objectsRes.query().$promise.then(function (data) {

        $scope.objects = data;
      });
    };

    $scope.loadObjectMetaData = function(){


      $scope.objectName = $routeParams.objectName;
      $scope.$on("objectMetaDataLoaded", function(ev, objectsMetaData){
        $scope.objectMetaData = objectsMetaData[$routeParams.objectName];
      });

      if (typeof $scope.objectsMetaData === "object" && typeof $scope.objectMetaData === "undefined"){
        $scope.objectMetaData = $scope.objectsMetaData[$routeParams.objectName];
      }
    };

    $scope.init = function(){

      $scope.listObjects();
      $scope.loadObjectMetaData();
    };

    $scope.init();
  });
