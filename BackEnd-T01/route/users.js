const controller = require("../controller/users.js");
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads');
     },
    filename: function (req, file, cb) {
        cb(null , file.originalname);
    }
});
const parser = multer({ storage: storage });
module.exports = function(app){
    app.get("/api/users/:id_session/", controller.findUserById);
    app.get("/api/users/:username/", controller.findUser);
    app.post("/api/users",parser.single('profilePicture'), controller.addUser);
    app.put("/api/users",parser.single('profilePicture'), controller.updateUser);
    app.post("/api/users/login", controller.loginUser);

}