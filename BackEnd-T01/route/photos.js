const controller = require("../controller/photos.js");
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
    app.get("/api/photos/:username/:id_session", controller.userPhotos);
    app.get("/api/photos/:id_session", controller.photosPerTime);
    app.post("/api/photos", parser.single('photoUrl'), controller.addPhoto);
    app.put("/api/photos/like", controller.likeDislikePhoto);
}