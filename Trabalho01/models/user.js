const mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017', {useNewUrlParser: true}); Modificar pro endereço da AWS
mongoose.set('useFindAndModify', false);

const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        username: {type: String, required: true},
        name: {type: String, required: true },
        password: {type: Date, required: true },
        email: {type: String, required: true },
        profilePicture: {type: String, required: true }
    }
);

module.exports = mongoose.model('User', UserSchema);