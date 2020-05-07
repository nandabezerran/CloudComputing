const controller = require("../controller/photos.js");
const multer = require('multer');
const parser = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  })

module.exports = function(app){
    app.get("/api/photos/:username/:id_session", controller.userPhotos);
    app.get("/api/photos/:id_session", controller.photosPerTime);
    app.post("/api/photos", parser.single('photoUrl'), controller.addPhoto);
    app.put("/api/photos/like", controller.likeDislikePhoto);
    //app.post("/api/photos/dates/:id_session", controller.findPhotoDate);
}