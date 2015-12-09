'use strict';

angular.module('meanCmsApp')
  .factory('data', function ($resource, $http, $q) {

    return {

      getObjectsMetaData : function(){

        var objectMetaData = $resource("api/objects");
        return objectMetaData;
      },

      getObject : function(objectName){

        var object = $resource("api/objects/" + objectName + "/:id", {id : "@id"}, { update: {method : "PUT", params : {id : "@id"}}});
        return object;
      },

      uploadFile : function(file, saveTo, type){

        var defered = $q.defer(),
          formData = new FormData();

        formData.append("file", file);
        formData.append("saveTo", saveTo);
        formData.append("type", type);

        $http.post("api/fileupload", formData, {
          transformRequest : angular.identity,
          headers : { "Content-Type" : undefined}
        }).success(function(response){

          console.log("success for file upload", response);

          defered.resolve(response);

        });

        return defered.promise;
      }
    }
  });
