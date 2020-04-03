const controller = require("../controller/users.js");

module.exports = function(app){
    app.get("/api/users/:username", controller.findUser);
    app.post("/api/users", controller.addUser);
    app.put("/api/users", controller.updateUser);

}