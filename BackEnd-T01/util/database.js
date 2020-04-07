var MongoClient = require('mongodb').MongoClient,
f = require('util').format,
fs = require('fs');

//Specify the Amazon DocumentDB cert
var ca = [fs.readFileSync("/opt/photo-app/BackEnd-T01/rds-combined-ca-bundle.pem")];

let _db;

//Create a MongoDB client, open a connection to Amazon DocumentDB as a replica set, 
//  and specify the read preference as secondary preferred

const mongoConnect = callback =>{

    MongoClient.connect(
    'mongodb://photoAppData:<insertYourPassword>@docdb-2020-04-07-17-08-43.cluster-clmniwzqtwwj.us-east-1.docdb.amazonaws.com:27017/?ssl=true&ssl_ca_certs=rds-combined-ca-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false',
    { 
    sslValidate: true,
    sslCA:ca,
    useNewUrlParser: true
    },
    function(err, client) {
        if(err)
            throw err;

        console.log("Mongo connected");
        _db = client.db();
        callback(_db);
    });
}

const getDB = () => {
    if (_db){
        return _db;
    }
    throw 'No Database found';
}

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;

/*const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
    MongoClient.connect('mongodb://localhost:27017')
    .then(client => {
        console.log("Mongo connected");
        
        
        _db = client.db();
        callback(_db);
    })
    .catch(err => {
        console.log(err);
        throw err;
    })
};


const getDB = () => {
    if (_db){
        return _db;
    }
    throw 'No Database found';
}

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;*/

/*var mongoConnect = MongoClient.connect(
'mongodb://photoAppData:password@docdb-2020-04-05-18-39-37.cluster-clmniwzqtwwj.us-east-1.docdb.amazonaws.com:27017/?ssl=true&ssl_ca_certs=rds-combined-ca-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false',
{ 
  sslValidate: true,
  sslCA:ca,
  useNewUrlParser: true
},
function(err, client) {
    if(err)
        throw err;

    console.log("Mongo connected");
    _db = s2ient.db();
    callback(_db);
});*/

/*
const mongoConnect = callback =>{
    MongoClient.connect(
    'mongodb://photoAppData:password@docdb-2020-04-05-18-39-37.cluster-clmniwzqtwwj.us-east-1.docdb.amazonaws.com:27017/?ssl=true&ssl_ca_certs=rds-combined-ca-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false',
    { 
    sslValidate: true,
    sslCA:ca,
    useNewUrlParser: true
    }
    ).then(client=>{
        console.log("Mongo connected");
        _db = client.db();
        callback(_db);
    }).catch(err =>{
        console.log(err);
        throw err; 
    });
*/
