const fs=require("fs")
const path=require("path")

function createFolder1(){
    const folderName=require("../app")
    console.log("foldername",folderName)
    fs.mkdir(path.join(__dirname,folderName.toString()),(err)=>{
        if (err) console.log(err)
        console.log("Folder created")
    })
}

module.exports=createFolder1