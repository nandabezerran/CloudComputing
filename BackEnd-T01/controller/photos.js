const GC_STORAGE = require("../util/gcloud-storage.js");
const admin = require('firebase-admin');
let db = admin.firestore();
const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'photo-app',
    password: 'admin',
    port: 5432,
})

module.exports.photosPerTime = async function (req, res) {
    var resJson = [];
    var aux = [];
    var size = 0;
    pool.query('SELECT * FROM photos', (error, results) => {
        if (error) {
          throw error
        }

        Promise.all(
            aux = (results.rows).map(async function(photo) {
            return{_id:photo.id, userId: photo.user_id, username: "undefined", date: photo.date, likes: photo.likes.length-1, youLiked: !!photo.likes.find(userId => (userId === req.params.id_session.toString())), postedPhoto: photo.photo_url, userAvatar: "undefined"}

        }))
        .then(resultsJson => {
            resultsJson.forEach(async photo => {
                const user = await db.collection('users').doc(photo.userId).get()
                photo.username = user.data().username;
                photo.userAvatar = user.data().profilePicture;
                resJson.push(photo)
                size = size + 1;
                if (resultsJson.length == size) {
                    res.send(resJson);
                }
            })
        });
    })
}

module.exports.userPhotos = async function (req, res) {
    var resJson;
    Promise.resolve( db.collection('users').doc(req.params.id_session).get())
    .then(user => {
        pool.query('SELECT * FROM photos WHERE user_id = $1',
        [String(req.params.id_session)], (error, results) => {
            if (error) {
            throw error
            }
            resJson = (results.rows).map(function(photo) {
                return{_id:photo.id, userId: photo.user_id, username: user.data().username, date: photo.date, likes: photo.likes.length-1, youLiked: !!photo.likes.find(userId => (userId === req.params.id_session.toString())), postedPhoto: photo.photo_url, userAvatar:  user.data().profilePicture}
            });
            res.send(resJson);
        })
    })
}

module.exports.addPhoto = async function (req, res) {
    const new_filename = req.body.userId + "/" + req.file.originalname;
    await GC_STORAGE.uploadGCS(new_filename, req.file)
        .then(async (gc_storage_file) => {
            const userId= req.body.userId;
            const date= Date.now();
            const likes= ["0"];
            pool.query('INSERT INTO photos (user_id, likes,date, photo_url) VALUES ($1, $3, $2, $4)', [userId, date, likes, gc_storage_file], (error, results) => {
                if (error) {
                    throw error
                }
                res.status(200).send()
                
            })
        })
}

module.exports.likeDislikePhoto = async function (req, res) {
    data = {}
    pool.query('SELECT * FROM photos WHERE id = $1', [req.body._id], (error, results) => {
        if (error) {
          throw error
        }
        var liked = (results.rows)[0].likes ? !!(results.rows)[0].likes.find(x => (x === req.body.userId)) : false;
        photoList = results.rows;
        if (liked) {
            const index = photoList[0].likes.indexOf(req.body.userId);
            photoList[0].likes.splice(index, 1);
            liked = false;
        }
        else {
            photoList[0].likes.push(req.body.userId);
            liked = true;
        }
        pool.query(
            'UPDATE photos SET likes = $1 WHERE id = $2',
            [photoList[0].likes, req.body._id],
            (error, results) => {
                if (error) {
                throw error
                }
                res.status(200).send();
            }
        )
    })
}

module.exports.findPhotoDate = async function (req, res) {
    let photoList = [];
    let resJson = [];
    var size = 0;
    Promise.resolve(
    pool.query('SELECT * FROM photos', (error, results) => {
        if (error) {
          throw error
        }

        Promise.all(
            aux = (results.rows).map(async function(photo) {
            return{_id:photo.id, userId: photo.user_id, username: "undefined", date: photo.date, likes: photo.likes.length-1, youLiked: !!photo.likes.find(userId => (userId === req.params.id_session.toString())), postedPhoto: photo.photo_url, userAvatar: "undefined"}

        }))
        .then(resultsJson => {
            resultsJson.forEach(async photo => {
                let dataI = new Date(req.body.dataInicial);
                dataI.setDate(dataI.getDate() + 1);
                let dataF = new Date(req.body.dataFinal);
                dataF.setDate(dataF.getDate() + 1);
                dataI = dataI.setHours(0, 0, 0, 0);
                dataF = dataF.setHours(0, 0, 0, 0);

                if (resultsJson.empty) {
                    res.status(404).send('Photos not found');
                    return;
                }
    
                else {
                    resultsJson.forEach(async doc => {
                        dateDoc = new Date(parseInt(doc.date));
                        if (dateDoc.setHours(0, 0, 0, 0) >= dataI && dateDoc.setHours(0, 0, 0, 0) <= dataF) {
                            photoList.push(doc);
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
        })  
    }))    
}