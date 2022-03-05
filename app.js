const express = require("express");
const ejs = require("ejs");
const fs = require('fs')
const fileUpload = require("express-fileupload");


const app = express();
app.use(fileUpload({
    limits: {
        fileSize: 2000000 //2mb
    },
    // abortOnLimit: true

}));

app.use(express.static("public"));
app.set("view engine", "ejs");


function limitHandle(req, res, path) {
    fs.unlinkSync(path);
    res.render("limit");
}


app.get("/", function (req, res) {
    res.render("index", { name: "Default.jpeg", altText: "" });
})


app.post("/", function (req, res) {

    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).render("nofile");
    }

    const uploadedImg = req.files.uploadImg;
    const uploadPath = __dirname + '/public/imgs/UploadedFiles/' + uploadedImg.name;
    const type = uploadedImg.mimetype;
    console.log(uploadedImg);


    uploadedImg.mv(uploadPath, function (err) {
        if (uploadedImg.truncated === true) {
            return limitHandle(req, res, uploadPath);
        }
        if (err) {
            return res.send(err);
        } else {
            res.render("index", { name: uploadedImg.name, altText: "Uploaded File is not an Image." });
        }

    });

})


app.listen(process.env.PORT || 3000, function () {
    console.log("server started at port 3000.");
});