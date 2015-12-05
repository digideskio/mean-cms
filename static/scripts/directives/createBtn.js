'use strict';

angular.module('meanCmsApp')
  .directive('createButton', function () {

    return {
      templateUrl : "scripts/templates/createBtn.html",
      scope : {
        name : "@name"
      }
    }
  });
