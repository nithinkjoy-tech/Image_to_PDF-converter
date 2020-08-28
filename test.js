const path = require('path');
const fs = require('fs');
const location=require("./app")
const directoryPath = path.join(__dirname, `image/${location}`);
let file_name = []

function findFileName(callback) {
    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        files.forEach(function (file) {
            file_name.push(file)
        });
        console.log("reached")

        callback(null, file_name)
    });
}

module.exports = findFileName