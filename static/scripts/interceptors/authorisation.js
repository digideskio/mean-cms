"use strict";

angular.module('meanCmsApp')
  .factory('authorisationInt', function ($q, $rootScope) {

    return {

      responseError : function(response){

        if (response.status === 401){
          $rootScope.isAuthed = false;
        }

        //TODO: 500 response error

        return response;
      }
    }
  });
