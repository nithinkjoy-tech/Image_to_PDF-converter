const express = require("express")
const app = express()
const expressLayout = require("express-ejs-layouts")
const multer = require("multer")
const createFolder = require("./output/makedir")
const {
    spawn
} = require("child_process")
const cookieParser = require("cookie-parser")
const ImagesToPDF = require('images-pdf');

app.use(cookieParser("its_secret"))
app.use(express.urlencoded({
    extended: false
}))

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
    const resize = req.cookies.resize
    console.log("rezs", resize)
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
            if (resize) {
                const process = spawn("python", ["./resize.py", `${location}`])
                process.stdout.on("data", () => {
                    createPdf()
                })
            } else {
                createPdf()
            }

            function createPdf() {
                new ImagesToPDF.ImagesToPDF().convertFolderToPDF(`image/${location}`, `output/${location}/${name}.pdf`);
                res.render("done")
            }
        }
    })
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening to port ${port}`))