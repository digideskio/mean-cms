var mongoose = require("mongoose");

module.exports = function(config){

  var db,
    connectionStr = config.database.connectionStr;

  return {

    getModel : function(modelName){

      var modelSchema,
        Model;

      try {

        modelSchema = require(config.models[modelName].schemaPath);
        Model = mongoose.model(modelName, modelSchema);

      } catch(e){}

      return Model;
    },

    connect : function(){

      db = mongoose.connect(connectionStr);
    },

    disconnect : function(){

      db.disconnect();
    },

    getModelMetaData : function(){

      return config.models;

    }
  }
};
