const Photo = require("../models/photo.js");
const User = require("../models/user.js");
const path = require('path');
const fs = require('fs');
const AWS_S3 = require("../util/aws-s3.js");

module.exports.photosPerTime = function(req,res){
    Photo.find().populate('userId')
    .exec()
    .then(photos => {
        var resJson = photos.map(function(photo) {
            return{_id:photo._id, userId: photo.userId._id, username: photo.userId.username, date: photo.date, likes: photo.likes.length-1, youLiked: !!photo.likes.find(userId => (userId === req.params.id_session.toString())), postedPhoto: photo.photoUrl, userAvatar: photo.userId.profilePicture}
        });
        res.send(resJson);
    });
}

module.exports.userPhotos = function(req, res){
    User.findOne({username: req.params.username})
    .then(user => {
        Photo.find({userId: user._id})
        .then(photos => {  
            var resJson = photos.map(function(photo) {
                return{_id:photo._id, userId: photo.userId, username: user.username, date: photo.date, likes: photo.likes.length-1, youLiked: !!photo.likes.find(userId => (userId === req.params.id_session.toString())), postedPhoto: photo.photoUrl, userAvatar: user.profilePicture}
            })
            res.send(resJson);        
        })
        .catch(err => console.log(err));
        
    })
    .catch(err => console.log(err));
}

function deleteFile(dir, file) {
    return new Promise(function (resolve, reject) {
        var filePath = path.join(dir, file);
        fs.lstat(filePath, function (err, stats) {
            if (err) {
                return reject(err);
            }
            if (stats.isDirectory()) {
                resolve(deleteDirectory(filePath));
            } else {
                fs.unlink(filePath, function (err) {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            }
        });
    });
};

module.exports.addPhoto = function(req, res){
    const newPhoto = new Photo(req.body);
    newPhoto
    .save()
    .then(newPhoto => {
        const new_filename = newPhoto.userId+"/"+ req.file.originalname;
        AWS_S3.uploadFileS3(new_filename, req.file.path)
        .then((aws_s3_file ) => {
            Photo.findByIdAndUpdate(newPhoto._id, {$set:{photoUrl:aws_s3_file.Location}},{new:true})
            .then(old_photo => {
                deleteFile(req.file.destination, req.file.originalname)
                .then(()=>{
                    res.send();   
                })                    
            })
        })
    })
        
    .catch(_err => {
        res.status(405).send('blabalada');
    }) 
}

module.exports.likeDislikePhoto = function(req, res){
    Photo.findOne({_id: req.body._id})
    .then(photo => {
        var liked = photo.likes ? !!photo.likes.find(x => (x === req.body.userId)) : false;
        
        if(liked){
            const index = photo.likes.indexOf(req.body.userId);
            photo.likes.splice(index,1);
            liked = false;
        }
        else{
            photo.likes.push(req.body.userId);
            liked = true;
            
        }
        photo.save()
        .then(res.status(200).send());
             
    })
    .catch(err => console.log(err));
}

module.exports.findPhotoDate = function(req, res){
    Photo.find({}).populate('userId')
    .exec()
    .then(photo => {
        console.log
        let dataI = new Date(req.body.dataInicial);
        dataI.setDate(dataI.getDate() + 1);
        let dataF = new Date(req.body.dataFinal);
        dataF.setDate(dataF.getDate() + 1);
        dataI = dataI.setHours(0,0,0,0)
        dataF = dataF.setHours(0,0,0,0)      
                
        photo = photo.filter((p) => p.date.setHours(0,0,0,0) >= dataI && p.date.setHours(0,0,0,0) <= dataF);
        var resJson = photo.map(function(photo) {            
            return{_id:photo._id, userId: photo.userId._id, username: photo.userId.username, date: photo.date, likes: photo.likes.length-1, youLiked: !!photo.likes.find(userId => (userId === req.params.id_session.toString())), postedPhoto: photo.photoUrl, userAvatar: photo.userId.profilePicture}
        });
        res.send(resJson);
        
             
    })
    .catch(err => console.log(err));
}