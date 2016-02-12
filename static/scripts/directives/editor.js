'use strict';

angular.module('meanCmsApp')
  .directive('editor', function ($timeout, data) {

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

            if (typeof validations !== "undefined"){
              for (var i = 0; i < validations.length; i++){

                isValid = validationFncs[validations[i]](scope.values[key]);

                if (!isValid){

                  invalid[key] = validations[i];
                  break;
                }
              }
            }
          }
        };

        scope.$watch(function(){

          return typeof scope.data === "object" && typeof scope.config === "object";

        }, function(){

          if (typeof scope.data === "object"){

            for (var key in scope.config){

              if (scope.config[key].type == "date"){

                scope.values[key] = formatDate(scope.data[key]);
              } else {
                scope.values[key] = scope.data[key];
              }
            }

            for (var key in scope.data){

              if (!scope.values.hasOwnProperty(key)){
                scope.values[key] = scope.data[key];
              }
            }
          }
        });

        var addLeadingZero = function(day){

          var ret = day;

          if (day < 10){
            ret = "0" + day;
          }
          return ret;
        }

        var formatDate = function(dateStr){

          var date = new Date(dateStr),
            newDateStr = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + addLeadingZero(date.getDate());

          return newDateStr;
        };

        scope.hasImage = function(fieldKey){

          return typeof scope.values[fieldKey] === "string" && scope.values[fieldKey].length > 0 ? true : false;
        };

        scope.uploadFile = function(fieldKey){

          var file = element.find("#" + fieldKey)[0].files[0],
            name = file.name;


          if (typeof file !== "undefined"){

            data.uploadFile(file, scope.config[fieldKey].filePath, "image").then(function(response){

              var pathToImage = scope.config[fieldKey].staticPath + "/" + name;
              scope.values[fieldKey] = pathToImage;

            });
          }
        };

        scope.reset = function(){

          if (typeof scope.data === "object"){

            scope.values = angular.copy(scope.data);

          } else {
            scope.values = {};
          }
        };

        scope.save = function(){

          scope.validate();

          if (scope.isValid()){
            scope.$emit("instanceSave", scope.values);
          }
        };

        scope.initCodeMirrorEditor = function(){

          scope.codeMirror = {};

          $timeout(function(){

            for (var key in scope.config) {

              if (scope.config[key].type === "html") {

                scope.codeMirror[key] = CodeMirror(document.getElementById("code-mirror-" + key));

                if (typeof scope.values[key] !== "undefined" && scope.values[key].length > 0){

                  scope.codeMirror[key].setValue(scope.values[key]);
                }

                scope.codeMirror[key].on("change", (function(intKey){

                  return function(instance, changeObj){

                    scope.values[intKey] = instance.getValue();
                  };
                }(key)));
              }
            }
          }, 1000);
        };

        scope.init = function(){

          scope.initCodeMirrorEditor();
        };

        scope.init();
      }
    }
  });
