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
                        _id: doc.id,
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
                        _id: doc.id,
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


module.exports.likeDislikePhoto = async function (req, res) {
    data = {}
    console.log(req.body.userId);
    const photo = await db.collection('photos').doc(req.body._id).get()
        .then(async photo => {
            var liked = photo.data().likes ? !!photo.data().likes.find(x => (x === req.body.userId)) : false;
            photoList = photo.data().likes;
            if (liked) {
                const index = photoList.indexOf(req.body.userId);
                photoList.splice(index, 1);
                data.likes = photoList;
                liked = false;
            }
            else {
                photoList.push(req.body.userId);
                console.log(photoList);
                data.likes = photoList;
                liked = true;
            }

            const updtPhoto = await db.collection('photos').doc(photo.id).set(data, { merge: true })
                .then(res.status(200).send())
        })
        .catch(err => console.log(err));


}

module.exports.findPhotoDate = async function (req, res) {
    let data = {};
    let photoList = [];
    let resJson = [];
    var size = 0;
    const photos = await db.collection('photos').get()
        .then(async snapshot => {
            let dataI = new Date(req.body.dataInicial);
            dataI.setDate(dataI.getDate() + 1);
            let dataF = new Date(req.body.dataFinal);
            dataF.setDate(dataF.getDate() + 1);
            dataI = dataI.setHours(0, 0, 0, 0)
            dataF = dataF.setHours(0, 0, 0, 0)
            
            

            if (snapshot.empty) {
                res.status(404).send('Photos not found');
                return;
            }

            else {
                snapshot.forEach(async doc => {
                    dateDoc = new Date(doc.data().date)
                    if (dateDoc.setHours(0, 0, 0, 0) >= dataI && dateDoc.setHours(0, 0, 0, 0) <= dataF) {
                        data = {
                            _id: doc.id,
                            userId: doc.data().userId,
                            date: doc.data().date,
                            likes: doc.data().likes.length - 1,
                            youLiked: !!doc.data().likes.find(userId => (userId === req.params.id_session.toString())),
                            postedPhoto: doc.data().photoUrl,
                        }
                        photoList.push(data);
                    }
                })
            }
        })

    if (photoList.length == 0) {
        res.send(photoList);
    }

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