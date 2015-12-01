module.exports = function(express, app, config){

  var baseUrl = config.baseUrl;

  app.use(baseUrl, express.static(config.staticFilePath));
};
