const controller = require("../controller/photos.js");

module.exports = function(app){
    app.get("/api/photos/:username", controller.userPhotos);
    app.post("/api/photos", controller.addPhoto);
    app.put("/api/photos", controller.likeDislikePhoto);
}