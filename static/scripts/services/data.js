'use strict';

angular.module('meanCmsApp')
  .factory('appCtrl', function ($resource) {

    return {

      getObjectsMetaData : function(){

        var objectMetaData = $resource("api/objects");
        return objectMetaData;
      }
    }
  });
