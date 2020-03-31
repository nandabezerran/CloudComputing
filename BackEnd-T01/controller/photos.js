const Photo = require("../models/photo.js")
const User = require("../models/user.js")


module.exports.userPhotos = function(req, res){
    Photo.find({username: req.body.username})
    .then(photos => { 
        var resJson = photos.map(function(photo) {
            return{_id:photo._id, user: photo.username, date: photo.date, likes: photo.likes.length, youLiked: !!photo.likes.find(user => (user === req.body.token)), postedPhoto: photo.photoUrl}
        })
        res.send(resJson);
    })
    .catch(err => console.log(err));
}

module.exports.addPhoto = function(req, res){
    const photo = new Photo(req.body);
    photo
    .save()
    .then(res.status(200).send(photo))
    .catch((err => {
        console.log(err);
    }));  
}

module.exports.likeDislikePhoto = function(req, res){
    Photo.findOne({_id: req.body._id})
    .then(photo => {
        var liked = !!photo.likes.find(x => x === req.body.userid);
        if(liked){
            const index = photo.likes.indexOf(req.body.userid);
            photo.likes.splice(index,1);
            liked = false;
        }
        else{
            photo.likes.push(req.body.userid);
            liked = true;
        }

        var resJson = {_id:photo._id, user: photo.username, data: photo.data, likes: photo.likes.length, youLiked: liked, postedPhoto: photo.photoUrl};
        res.send(resJson);
    })
    .catch(err => console.log(err));
}
