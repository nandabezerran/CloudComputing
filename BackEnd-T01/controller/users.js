const GC_STORAGE = require("../util/gcloud-storage.js");
const admin = require('firebase-admin');
let serviceAccount = require('../util/photo-app-cloud-276315-87209affba8a.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();


module.exports.findUserById = async function(req, res){
    const sessionId = req.params.id_session;
    const user = await db.collection('users').doc(sessionId).get()
    if(!user.exists){
        res.status(500).send("User not found");
    }
    else{
        res.status(200).send(user.data())
    }
}

module.exports.findUser = async function(req, res){
    let users = db.collection('users');
    let user = users.where('username', '==', req.params.username).get()
    .then(snapshot => {
        if (snapshot.empty) {
            res.status(404).send('Username not found');
            return;
        }

        snapshot.forEach(doc => {
            res.status(200).send(doc.data())
        });
    })
    .catch(err => {
        console.log('Error getting documents', err);
    });
    
}

module.exports.findUserName = async function(req, res){
    let users = db.collection('users');
    let user = users.where('name', '==', req.body.name).get()
    .then(snapshot => {
        if (snapshot.empty) {
            res.status(404).send('Name not found');
            return;
        }

        snapshot.forEach(doc => {
            res.status(200).send(doc.data())
        });
    })
    .catch(err => {
        console.log('Error getting documents', err);
    });

}

module.exports.addUser = async function(req, res){
    const user = await db.collection('users').doc(req.body.username).get();
    if (user.exists){
        res.status(500).send("Username already in use");
    }
    else{
        const data = {
            username: req.body.username,
            name: req.body.name,
            password: req.body.password,
            email: req.body.email,
        }
        const addUser = await db.collection('users').add(data);
        const new_filename = addUser.id + "/profilePic/" + req.file.originalname;
        await GC_STORAGE.uploadGCS(new_filename, req.file)
        .then( async (gc_storage_file) => {
            data.profilePicture = gc_storage_file;
            const updtUser = await db.collection('users').doc(addUser.id).set(data, { merge: true })
        })
        
        res.json({
            id:addUser.id
        });
        
    }
}

module.exports.updateUser = async function(req, res){
    const id = req.body.userId;
    const user = await db.collection('users').doc(id).get()
    if (!user.exists){
        res.status(500).send("Username not found");
    }
    else{
        const data = {
            name: req.body.name,
            password: req.body.password,
            email: req.body.email,
        }
        const new_filename = user.id + "/profilePic/" + req.file.originalname;
        await GC_STORAGE.uploadGCS(new_filename, req.file)
        .then(async (gc_storage_file) => {
            data.profilePicture = gc_storage_file;
            const updtUser = await db.collection('users').doc(user.id).set(data, { merge: true })
        })
        res.json({
            id:user.id
        });
    }



}

module.exports.loginUser = async function(req, res){
    let users = db.collection('users');
    let user = users.where('username', '==', req.body.username).get()
    .then(snapshot => {
        if (snapshot.empty) {
        res.status(404).send('Username not found');
        return;
        }

        snapshot.forEach(doc => {
        if(req.body.password == doc.data().password){
            res.json({
                id: doc.id
            })
        }
        else{
            res.status(500).send('Invalid Password')
        }
        });
    })
    .catch(err => {
        console.log('Error getting documents', err);
    });






}

