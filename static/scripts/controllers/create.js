'use strict';

angular.module('meanCmsApp')
  .controller('createCtrl', function ($scope, $routeParams, $rootScope, data, $location) {

    $scope.loadObjectMetaData = function(){

      $scope.$on("objectMetaDataLoaded", function(ev, objectsMetaData){

        $scope.objectMetaData = objectsMetaData[$routeParams.objectName];
      });

      if (typeof $scope.objectsMetaData === "object" && typeof $scope.objectMetaData === "undefined"){

        $scope.objectMetaData = $scope.objectsMetaData[$routeParams.objectName];
      }
    };

    $scope.init = function(){

      $scope.loadObjectMetaData();

      $scope.$on("instanceSave", function(ev, values){

        var Object = data.getObject($routeParams.objectName),
          object = new Object(values);

        object.$save().then(function(response){

          //TODO: redirect to list page and highlight new instance
        });
      });
    };

    $scope.init();
  });
