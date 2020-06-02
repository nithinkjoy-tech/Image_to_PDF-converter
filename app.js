const express=require("express")
const app=express()
const expressLayout=require("express-ejs-layouts")
const multer=require("multer")
const createFolder=require("./output/makedir")
const cookieParser=require("cookie-parser")
app.use(cookieParser("its_secret"))

const cookieConfig={
    signed:true,
    httpOnly:true
}

app.use(expressLayout)
app.set("view engine","ejs")

app.get("/",(req,res)=>{
    const folderName=Date.now().toString()
    module.exports=folderName
    createFolder()
    res.cookie("nithin_pdf",folderName,cookieConfig)
    res.render("upload")
})

app.post("/download",(req,res)=>{
    const location=req.signedCookies.nithin_pdf
    res.download(__dirname+`/output/${location}/Your_pictures.pdf`)
})

app.post("/upload",(req,res)=>{
    const location=req.signedCookies.nithin_pdf
    console.log("location",location)
    const storage=multer.diskStorage({
        destination:`./image/${location}`,
        filename:function(req,file,cb){   
            cb(null,Date.now()+file.originalname)
        } 
    })
    
    const upload=multer({
        storage:storage
    }).array('myImage', 100)
    upload(req,res,(err)=>{
        if(err){
            res.render("upload",{message:err})
        }else{
            console.log(req.file)
            const ImagesToPDF = require('images-pdf');
            new ImagesToPDF.ImagesToPDF().convertFolderToPDF(`image/${location}`, `output/${location}/Your_pictures.pdf`);
            res.render("done")
        }
    })
})

const port=process.env.PORT||3000
app.listen(port,()=>console.log(`Listening to port ${port}`))

