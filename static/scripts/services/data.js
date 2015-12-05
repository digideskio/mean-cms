'use strict';

angular.module('meanCmsApp')
  .factory('data', function ($resource) {

    return {

      getObjectsMetaData : function(){

        var objectMetaData = $resource("api/objects");
        return objectMetaData;
      },

      getObject : function(objectName){

        var object = $resource("api/objects/" + objectName);
        return object;
      }
    }
  });
