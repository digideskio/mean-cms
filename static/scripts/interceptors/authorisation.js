"use strict";

angular.module('meanCmsApp')
  .factory('authorisationInt', function ($q) {

    return {


      response : function(response){

        console.log("interceptor response", response);

        return response;
      },

      responseError : function(response){

        console.log("responseError", response);

        return response;

      }
    }
  });
