const util = require('util');
const {Storage} = require('@google-cloud/storage')
const fs = require('fs');
const gc = new Storage({
    keyFilename: 'util/keys.json',
    projectId: 'photo-app-cloud-274317'
})

const photosBucket = gc.bucket('photo-app-photos');

module.exports.uploadGCS = (fileName, file) => new Promise((resolve, reject) => {
    const { buffer} = file;
    const blob = photosBucket.file(fileName.replace(/ /g, "_"));
    const blobStream = blob.createWriteStream({
      resumable: false
      
    })
    blobStream.on('finish', () => {
      const publicUrl = util.format(
        'https://storage.cloud.google.com/%s/%s', photosBucket.name, blob.name
      )
      resolve(publicUrl)
    })
    .on('error', () => {
      reject(`Unable to upload image, something went wrong`)
    })
    .end(buffer)
})
