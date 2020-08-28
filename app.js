const express = require("express")
const app = express()
const expressLayout = require("express-ejs-layouts")
const multer = require("multer")
const createFolder = require("./output/makedir")
const createFolder1 = require("./image/makedir1")
const cookieParser = require("cookie-parser")
const ImagesToPDF = require('images-pdf');
const sharp = require("sharp")
const fs = require("fs")
app.use(cookieParser("its_secret"))

const cookieConfig = {
    signed: true,
    httpOnly: true
}

app.use(expressLayout)
app.set("view engine", "ejs")

app.get("/", (req, res) => {
    const folderName = Date.now().toString()
    module.exports = folderName
    createFolder()
    res.cookie("nithin_pdf", folderName, cookieConfig)
    res.render("upload")
})

app.post("/download", (req, res) => {
    const location = req.signedCookies.nithin_pdf
    const name = req.signedCookies.nithin_name
    res.download(__dirname + `/output/${location}/${name}.pdf`)
})

app.post("/upload", (req, res) => {
    const location = req.signedCookies.nithin_pdf
    console.log("location", location)
    module.exports = location
    const storage = multer.diskStorage({
        destination: `./image/${location}`,
        filename: function (req, file, cb) {
            cb(null, Date.now() + file.originalname)
        }
    })

    const upload = multer({
        storage
    }).array('myImage', 100)
    upload(req, res, async (err) => {
        if (err) {
            res.render("upload", {
                message: err
            })
        } else {
            console.log(req.file)
            name = Date.now()
            res.cookie("nithin_name", name, cookieConfig)
            const findFileName = require("./test.js")
            folderName = req.signedCookies.nithin_pdf + "100"
            module.exports = folderName
            createFolder1()
            findFileName((err, file_name) => {
                console.log("filename", file_name)
                for (i = 0; i < file_name.length; i++) {
                    fl = `./image/${location}/${file_name[i]}`
                    console.log(fl)
                    sharp(fl)
                        .resize(749, 1000)
                        .toFile(`${fl}+new.jpg`, (err, info) => {
                            if (err) {
                                return console.log("something went wrong", err)
                            }
                            console.log("succesfully done", info)
                        })
                        .then(()=>{
                            fs.unlink(`${fl}`, function(err) {
                                if (err) {
                                  throw err
                                } else {
                                  console.log("Successfully deleted the file.")
                                }
                              })
                        })
                }

                    new ImagesToPDF.ImagesToPDF().convertFolderToPDF(`image/${folderName}`, `output/${location}/${name}.pdf`);
                    res.render("done")
            })

        }
    })
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening to port ${port}`))