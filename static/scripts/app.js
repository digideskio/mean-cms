'use strict';

angular.module('meanCmsApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/index.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(function($rootScope, authorisation){

    authorisation.isAuthorised().then(function(rep){

      var json = rep.data;

      if (json.success === true){
        $rootScope.isAuthed = true;
      } else {
        $rootScope.isAuthed = false;
      }

      $rootScope.loading = false;
    });
  });
