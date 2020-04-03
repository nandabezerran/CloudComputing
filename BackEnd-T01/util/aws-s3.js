const AWS = require('aws-sdk');
const fs = require('fs');

const BUCKET_NAME = 'cc-photo-app-images';

const s3 = new AWS.S3();

const params = {
  Bucket: BUCKET_NAME,
  CreateBucketConfiguration: {
    LocationConstraint: "us-east-1"
  }
};

module.exports.uploadFileS3 = (fileName, file) => {
  return new Promise((resolve, reject) => {
    console.log(file);        // Setting up S3 upload parameters
    const params = {
      Bucket: BUCKET_NAME,
      Key: fileName, // File name you want to save as in S3
      Body: fs.createReadStream(file)
    };
    
    s3.upload(params, function(err, data) {
        if (err) {
            reject(err);
        }
        else {
            console.log(`File uploaded successfully. ${data.Location}`);
            resolve(data);
        }
    });
  })
};


module.exports.removeFileS3 = (filename) => {
  let bucketObject = filename.substr("https://"+BUCKET_NAME+".s3.amazonaws.com/".length);
  return new Promise((resolve, reject) => {
    // Setting up S3 upload parameters
    const params = {
        Bucket: BUCKET_NAME,
        Key: bucketObject
    };

    s3.deleteObject(params, function(err, data) {
        if (err) {
            reject(err);
        }
        else {
            console.log(`File delete successfully. ${data}`);
            resolve(data);
        }
    });
  })
};
