'use strict';

angular.module('meanCmsApp')
  .factory('authorisation', function ($http, $q, $rootScope) {

    var authPromise = $q.defer();

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
      },

      getAuthPromise : function(){

        return authPromise.promise;
      },

      authCheckPromiseComplete : function(success){

        authPromise.resolve(success);

      }

    }
  })
;
