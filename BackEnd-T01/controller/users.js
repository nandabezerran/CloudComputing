const GC_STORAGE = require("../util/gcloud-storage.js");
const admin = require('firebase-admin');
let serviceAccount = require('../util/photo-app-cloud-274317-49bee834f1c9.json');

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
    /*User.findOne({_id: req.params.id_session})
    .then(user => {
        res.status(200).send(user);
        
    })
    .catch(err => {
        console.log(err);
        res.status(404).send("User not found");
    });*/
}

module.exports.findUser = async function(req, res){
    console.log('entrei na função')
    let users = db.collection('users');
    let user = users.where('username', '==', req.params.username).get()
    .then(snapshot => {
        if (snapshot.empty) {
            res.status(404).send('Username not found');
            return;
        }

        snapshot.forEach(doc => {
            console.log('entrei')
            console.log(doc.data())
            res.status(200).send(doc.data())
        });
    })
    .catch(err => {
        console.log('Error getting documents', err);
    });
    
    /*User.findOne({username: req.params.username})
    .then(user => {
        res.status(200).send(user)
    })
    .catch(err => {
        console.log(err);
        res.status(404).send("User not found");
    });*/
}

module.exports.findUserName = async function(req, res){
    console.log('entrei na função')
    let users = db.collection('users');
    let user = users.where('name', '==', req.params.name).get()
    .then(snapshot => {
        if (snapshot.empty) {
            res.status(404).send('Name not found');
            return;
        }

        snapshot.forEach(doc => {
            console.log('entrei')
            console.log(doc.data())
            res.status(200).send(doc.data())
        });
    })
    .catch(err => {
        console.log('Error getting documents', err);
    });


    /*console.log(req.params.name);
    User.exists({name: req.params.name})
    .then(user => {
        res.status(200).send(user)
    })
    .catch(err => {
        console.log(err);
        res.status(404).send("User not found");
    });*/
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
            console.log(data);
            const updtUser = await db.collection('users').doc(addUser.id).set(data, { merge: true })
        })
        
        res.json({
            id:addUser.id
        });
        
    }

    /*User.exists({username: req.body.username})
    .then(user => {
        if(user.username){
            res.status(500).send("Username already in use");
        }
        else{
            const user = new User(req.body);
            user
            .save()
            .then(newUser => {
                const new_filename = newUser._id+"/profilePic/"+ req.file.originalname;
                GC_STORAGE.uploadGCS(new_filename, req.file)
                .then((gc_storage_file) => {
                    User.findByIdAndUpdate(newUser._id, {$set:{profilePicture:gc_storage_file}},{new:true})
                    .then(old_photo => {
                        res.status(200).send(newUser._id);
                                            
                    })
                })
            })
            .catch((err => {
                console.log(err);
            }));  
        }
    })   
    .catch((err => {
        console.log(err);
    }))*/
}

module.exports.updateUser = async function(req, res){
    const id = req.body.userId;
    console.log(id);
    const user = await db.collection('users').doc(id).get()
    if (!user.exists){
        res.status(500).send("Username not found");
    }
    else{
        console.log("entrou no else do update")
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


    /*User.findOneAndUpdate({_id:req.body.userId}, {$set:{name:req.body.name, password:req.body.password, email: req.body.email}},{new:true})
    .then(old_aluno => {
        if(req.file!=undefined){
            const new_filename = req.body.userId+"/profilePic/"+ req.file.originalname;
            GC_STORAGE.uploadGCS(new_filename, req.file)
            .then((gc_storage_file) => {
                User.findByIdAndUpdate(newUser._id, {$set:{profilePicture:gc_storage_file}},{new:true})
                .then(old_photo => {
                    res.status(200).send(newUser._id);
                                        
                })
            })    
        }     
    })
    .catch(err => {
        console.log(err);
        res.status(404).send("User not found");
    }); */
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





    /*const users = await db.collection('users');
    const username = await users.where('username', '==', req.body.username).get();
    console.log(req.body.username)
    if(!username.exists){
        res.status(500).send("Username not found");
    }
    else{
        if(username.password == '12345678'){
            res.json({
                id: user.id
            });
        }
        else{
            res.status(500).send("Password not found")
        }
    }*/
}

