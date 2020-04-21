const Photo = require("../models/photo.js");
const User = require("../models/user.js");
const GC_STORAGE = require("../util/gcloud-storage.js");
const admin = require('firebase-admin');
let db = admin.firestore();



module.exports.photosPerTime = async function (req, res) {
    let data = {};
    let photoList = [];
    let resJson = [];
    var size = 0;
    const photos = await db.collection('photos').get()
        .then(async snapshot => {
            if (snapshot.empty) {
                res.status(404).send('Photos not found');
                return;
            }

            else {
                snapshot.forEach(async doc => {
                    data = {
                        id: doc.id,
                        userId: doc.data().userId,
                        date: doc.data().date,
                        likes: doc.data().likes.length - 1,
                        youLiked: !!doc.data().likes.find(userId => (userId === req.params.id_session.toString())),
                        postedPhoto: doc.data().photoUrl,
                    }
                    photoList.push(data);
                })
            }
        })
    photoList.forEach(async photo => {
        const user = await db.collection('users').doc(photo.userId).get()
        photo.username = user.data().username;
        photo.userAvatar = user.data().profilePicture;
        resJson.push(photo)
        size = size + 1;
        if (photoList.length == size) {
            res.send(resJson);
        }
    })


}


module.exports.userPhotos = async function (req, res) {
    let photoList = [];
    let user = await db.collection('users').doc(req.params.id_session).get()
    let photo = await db.collection('photos').where('userId', '==', req.params.id_session).get()
        .then(async snapshot => {
            if (snapshot.empty) {
                res.status(404).send('Photos not found');
                return;
            }

            else {
                snapshot.forEach(async doc => {
                    data = {
                        id: doc.id,
                        userId: doc.data().userId,
                        username: user.data().username,
                        date: doc.data().date,
                        likes: doc.data().likes.length - 1,
                        youLiked: !!doc.data().likes.find(userId => (userId === req.params.id_session.toString())),
                        postedPhoto: doc.data().photoUrl,
                        userAvatar: user.data().profilePicture
                    }
                    photoList.push(data);
                })
            }
        })
    res.send(photoList);

    /*User.findOne({ username: req.params.username })
        .then(user => {
            Photo.find({ userId: user._id })
                .then(photos => {
                    var resJson = photos.map(function (photo) {
                        return { _id: photo._id, userId: photo.userId, username: user.username, date: photo.date, likes: photo.likes.length - 1, youLiked: !!photo.likes.find(userId => (userId === req.params.id_session.toString())), postedPhoto: photo.photoUrl, userAvatar: user.profilePicture }
                    })
                    res.send(resJson);
                })
                .catch(err => console.log(err));

        })
        .catch(err => console.log(err));*/
}

module.exports.addPhoto = async function (req, res) {

    const data = {
        userId: req.body.userId,
        date: Date.now(),
        likes: ["0"],
    }
    const addPhoto = await db.collection('photos').add(data);
    const new_filename = data.userId + "/" + req.file.originalname;
    await GC_STORAGE.uploadGCS(new_filename, req.file)
        .then(async (gc_storage_file) => {
            data.photoUrl = gc_storage_file;
            const updtPhoto = await db.collection('photos').doc(addPhoto.id).set(data, { merge: true })
        })
    res.send()

}


module.exports.likeDislikePhoto = function (req, res) {
    Photo.findOne({ _id: req.body._id })
        .then(photo => {
            var liked = photo.likes ? !!photo.likes.find(x => (x === req.body.userId)) : false;

            if (liked) {
                const index = photo.likes.indexOf(req.body.userId);
                photo.likes.splice(index, 1);
                liked = false;
            }
            else {
                photo.likes.push(req.body.userId);
                liked = true;

            }
            photo.save()
                .then(res.status(200).send());

        })
        .catch(err => console.log(err));
}

module.exports.findPhotoDate = function (req, res) {
    Photo.find({}).populate('userId')
        .exec()
        .then(photo => {
            let dataI = new Date(req.body.dataInicial);
            dataI.setDate(dataI.getDate() + 1);
            let dataF = new Date(req.body.dataFinal);
            dataF.setDate(dataF.getDate() + 1);
            dataI = dataI.setHours(0, 0, 0, 0)
            dataF = dataF.setHours(0, 0, 0, 0)

            photo = photo.filter((p) => p.date.setHours(0, 0, 0, 0) >= dataI && p.date.setHours(0, 0, 0, 0) <= dataF);
            var resJson = photo.map(function (photo) {
                return { _id: photo._id, userId: photo.userId._id, username: photo.userId.username, date: photo.date, likes: photo.likes.length - 1, youLiked: !!photo.likes.find(userId => (userId === req.params.id_session.toString())), postedPhoto: photo.photoUrl, userAvatar: photo.userId.profilePicture }
            });
            res.send(resJson);


        })
        .catch(err => console.log(err));
}