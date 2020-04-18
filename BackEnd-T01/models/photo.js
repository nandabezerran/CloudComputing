const mongoose = require('mongoose');

//fs = require('fs');

//var ca = [fs.readFileSync("/opt/photo-app/BackEnd-T01/rds-combined-ca-bundle.pem")];

//mongoose.connect('mongodb://photoApp:cloud159@docdb-2020-04-07-18-11-00.cluster-clmniwzqtwwj.us-east-1.docdb.amazonaws.com:27017/?ssl=true&ssl_ca_certs=rds-combined-ca-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false', {sslValidate: true, sslCA:ca, useNewUrlParser: true});// Modificar pro endereço da AWS
mongoose.connect('mongodb://localhost:27017', {useNewUrlParser: true});// Modificar pro endereço da AWS

mongoose.set('useFindAndModify', false);

const Schema = mongoose.Schema;

const PhotoSchema = new Schema(
    {
        userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
        date: {type: Date, required: true, default: Date.now },
        likes: {type: [String], required:true, default: " "},
        photoUrl: String
    }
);

module.exports = mongoose.model('Photo', PhotoSchema);