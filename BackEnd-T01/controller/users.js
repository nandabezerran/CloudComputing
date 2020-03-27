const User= require("../models/user.js")
const Photo = require("../models/photo.js")

module.exports.findUser = function(req, res){
    User.find({username: req.params.username})
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
        if(user){
            res.status(500).send("Username already in use");
        }
        else{
            const user = new User(req.body);
            user
            .save()
            .then(res.status(200).send(user))
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
    User.findOneAndUpdate({username:req.body.username}, {$set:{name:req.body.name, username:req.body.username, password:req.body.password, email: req.body.email, profilePicture:req.body.profilePicture}},{new:true})
    .then(old_aluno => {
        res.send(old_aluno)        
    })
    .catch(err => {
        console.log(err);
        res.status(404).send("User not found");
    });
}