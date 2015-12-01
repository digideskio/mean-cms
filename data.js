var mongoose = require("mongoose");

module.exports = function(config){

  var db,
    connectionStr = config.database.connectionStr;

  return {

    loadModels : function(config){

    },

    connect : function(){

      db = mongoose.connect(connectionStr);
    },

    disconnect : function(){

      db.disconnect();
    },

    getModel : function(name){

      if (models.hasOwnProperty(name)){
        return models[name];
      } else {
        return null
      }
    }
  }
};
