'use strict';

angular.module('meanCmsApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider, $httpProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/index.html',
        controller: 'MainCtrl'
      })
      .when("/objects/:objectName/list", {
        templateUrl : "views/list.html",
        controller : "listCtrl"
      })
      .when("/objects/:objectName/create", {
        templateUrl : "views/create.html",
        controller : "createCtrl"
      })
      .otherwise({
        redirectTo: '/'
      });

    $httpProvider.interceptors.push("authorisationInt");
  })
  .run(function($rootScope, authorisation){

    authorisation.isAuthorised().then(function(rep){

      var json = rep.data;

      if (json.success === true){
        $rootScope.isAuthed = true;
        authorisation.authCheckPromiseComplete(true);
      } else {
        $rootScope.isAuthed = false;
      }

      $rootScope.loading = false;
    });
  });
