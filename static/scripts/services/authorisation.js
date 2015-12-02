'use strict';

angular.module('meanCmsApp')
  .factory('authorisation', function ($http) {

    return {

      isAuthorised : function(){

        return $http.get("api/isloggedin");
      },

      authorise: function (username, password) {

        return $http.post(
          "api/login",
          {
            username: username,
            password: password
          });
      }
    }
  })
;
