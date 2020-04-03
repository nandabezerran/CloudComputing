const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017', {useNewUrlParser: true});// Modificar pro endereço da AWS
mongoose.set('useFindAndModify', false);

const Schema = mongoose.Schema;

const PhotoSchema = new Schema(
    {
        username: {type: String, required: true},
        date: {type: Date, required: true, default: Date.now },
        likes: [{type: String, required: true}],
        photoUrl: {type: String, required: true}
    }
);

module.exports = mongoose.model('Photo', PhotoSchema);