'use strict';

angular.module('meanCmsApp')
  .directive('editor', function () {

    return {
      templateUrl : "scripts/templates/editor.html",
      scope : {
        config : "=config",
        data : "=data"
      },
      link : function(scope, element, attrs){

        var validationFncs = {
          required : function(value){

            if (typeof value === "undefined" || value === ""){
              return false;
            } else {
              return true;
            }
          }
        };

        var validationMsgs = {
          required : "This field is required"
        };

        scope.values = {};
        var invalid = {};


        scope.getValidationMsg = function(fieldName){

          return validationMsgs[invalid[fieldName]];
        };

        scope.isInvalid = function(fieldName){

          return typeof invalid[fieldName] === "undefined" ? false : true;
        };

        scope.isValid = function(){

          return Object.keys(invalid).length === 0 ? true : false;
        };

        scope.validate = function(){

          var isValid,
            validations;

          invalid = {};

          for (var key in scope.config){

            validations = scope.config[key].validation;

            for (var i = 0; i < validations.length; i++){

              isValid = validationFncs[validations[i]](scope.values[key]);

              if (!isValid){

                invalid[key] = validations[i];
                break;
              }
            }
          }
        };

        scope.$watch("data", function(){

          if (typeof scope.data === "object"){

            //TODO: implement as editor form
          }
        });

        scope.reset = function(){

          //TODO: are you sure dialog?

          scope.values = {};

        };

        scope.save = function(){

          scope.validate();

          if (scope.isValid()){
            scope.$emit("instanceSave", scope.values);
          }
        }
      }
    }
  });
