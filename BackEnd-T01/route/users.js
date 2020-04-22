const controller = require("../controller/users.js");
const multer = require('multer');
const parser = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  })
module.exports = function(app){
    app.get("/api/users/:id_session/", controller.findUserById);
    app.get("/api/users/username/:username/", controller.findUser);
    app.put("/api/users/name/", controller.findUserName);
    app.post("/api/users",parser.single('profilePicture'), controller.addUser);
    app.put("/api/users",parser.single('profilePicture'), controller.updateUser);
    app.post("/api/users/login", controller.loginUser);

}