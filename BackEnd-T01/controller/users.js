const User= require("../models/user.js");
const GC_STORAGE = require("../util/gcloud-storage.js");


module.exports.findUserById = function(req, res){
    User.findOne({_id: req.params.id_session})
    .then(user => {
        res.status(200).send(user);
        
    })
    .catch(err => {
        console.log(err);
        res.status(404).send("User not found");
    });
}

module.exports.findUser = function(req, res){
    User.findOne({username: req.params.username})
    .then(user => {
        res.status(200).send(user)
    })
    .catch(err => {
        console.log(err);
        res.status(404).send("User not found");
    });
}

module.exports.findUserName = function(req, res){
    console.log(req.params.name);
    User.exists({name: req.params.name})
    .then(user => {
        res.status(200).send(user)
    })
    .catch(err => {
        console.log(err);
        res.status(404).send("User not found");
    });
}

module.exports.addUser = function(req, res){
    User.exists({username: req.body.username})
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
    }))
}

module.exports.updateUser = function(req, res){
    User.findOneAndUpdate({_id:req.body.userId}, {$set:{name:req.body.name, password:req.body.password, email: req.body.email}},{new:true})
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
    });
}

module.exports.loginUser = function(req, res){
    User.findOne({username: req.body.username})
    .then(user => {
        if(user.password.toString() === req.body.password.toString()){
            res.status(200).send(user._id);
        }
        else{
            res.status(500).send("Senha incorreta"); 
        }
        
    })
    .catch(err => {
        console.log(err);
        res.status(404).send("User not found");
    });
}

