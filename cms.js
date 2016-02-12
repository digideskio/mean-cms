var DataAccessLayer = require("./data");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var bodyParser = require('body-parser');
var multer = require("multer");
var upload = multer();
var fs = require("fs");

module.exports = function (express, app, config) {

  var dataAccessLayer = DataAccessLayer(config),
    baseUrl = config.baseUrl;

  app.use(cookieParser());
  app.use(session({
    secret: "kn0tr33fn0d34pp"
  }));

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({extended: false}));

  // parse application/json
  app.use(bodyParser.json());

  //static file handler
  app.use(baseUrl, express.static(config.staticFilePath));

  //log in route
  app.post(baseUrl + "/api/login", function (req, res) {

    var username = req.body && req.body.username ? req.body.username : "",
      password = req.body && req.body.password ? req.body.password : "",
      credentials = config.userCredentials;

    //check credentials
    for (var i = 0; i < credentials.length; i++) {

      if (credentials[i].username === username && credentials[i].password === password) {
        req.session.auth = true;

        res.status = 200;
        res.json({
          success: true,
          message: "Authentication successful"
        });

        break;
      } else if (i == credentials.length - 1 && (credentials[i].username !== username || credentials[i].password !== password)) {
        req.session.auth = false;

        res.status = 200;
        res.json({
          success: false,
          message: "Authentication failed"
        });
      }
    }
  });

  app.get(baseUrl + "/api/isloggedin", function (req, res) {

    if (req.session.auth === true) {

      res.json({
        success: true,
        message: "User logged in"
      });
    } else {

      res.json({
        success: false,
        message: "User not logged in"
      });
    }
  });

  //authorisation url reg ex
  var authRegEx = new RegExp(baseUrl + "\/api\/(.*)");

  //authorisation / authentication check
  app.use(authRegEx, function (req, res, next) {

    if (req.session.auth === true) {
      next();
    } else {

      res.status(401);
      res.json({
        success: false,
        message: "You are not authorised to access this url",
      });
    }
  });

  //get object meta data
  app.get(baseUrl + "/api/objects", function (req, res) {

    var models = dataAccessLayer.getModelMetaData();

    res.json(models);
  });

  //get all object of one type
  app.get(baseUrl + "/api/objects/:objectName", function (req, res) {

    var objectName = req.params.objectName,
      Model = dataAccessLayer.getModel(objectName);

    if (typeof Model !== "undefined") {

      dataAccessLayer.connect();

      Model.find({}, function (err, objects) {

        res.json(objects);

        dataAccessLayer.disconnect();

      });
    } else {

      res.status(500);

      res.json({
        success: false,
        message: "There is no object with the name " + objectName
      });
    }

  });

  //add new object of given type
  app.post(baseUrl + "/api/objects/:objectName", function (req, res) {

    var objectName = req.params.objectName,
      Model = dataAccessLayer.getModel(objectName),
      model = new Model(req.body);

    dataAccessLayer.connect();

    model.save(function (err) {

      res.json({
        success: true,
        message: "New model successfully created"
      });

      dataAccessLayer.disconnect();

    });
  });

  //delete object of given type and with id
  app.delete(baseUrl + "/api/objects/:objectName/:id", function (req, res) {

    var objectName = req.params.objectName,
      id = req.params.id,
      Model = dataAccessLayer.getModel(objectName);

    dataAccessLayer.connect();

    Model.find({"_id": id}).remove(function (err) {

      dataAccessLayer.disconnect();

      res.json({
        success: true,
        message: "Successfully removed object with id: " + id
      });
    });
  });

  //get object instance
  app.get(baseUrl + "/api/objects/:objectName/:id", function (req, res) {

    var objectName = req.params.objectName,
      id = req.params.id,
      Model = dataAccessLayer.getModel(objectName);

    dataAccessLayer.connect();

    Model.find({"_id": id}, function (err, object) {

      res.json(object[0]);
      dataAccessLayer.disconnect();
    });
  });

  //update object instance
  app.put(baseUrl + "/api/objects/:objectName/:id", function (req, res) {

    var objectName = req.params.objectName,
      id = req.params.id,
      update = req.body,
      Model = dataAccessLayer.getModel(objectName);

    dataAccessLayer.connect();

    Model.update({_id: id}, update, function (err) {

      res.json({
        success: true,
        message: "Successfully updated object with id: " + id
      });

      dataAccessLayer.disconnect();

    });
  });

  //file upload handler
  app.post(baseUrl + "/api/fileupload", upload.single("file"), function (req, res) {

    var saveTo = req.body.saveTo;

    fs.writeFile(saveTo + "/" + req.file.originalname, req.file.buffer, 'binary', function(err){

      console.log(err);

      res.json({
        success : true,
        message : "File saved to disk"
      });
    });
  });
};
