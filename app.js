const mysql = require("mysql2");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const pdfTemplate = require('./templates/pdf.js')
const pdf = require("html-pdf");
const multer = require("multer");
const moment = require('moment')
const upload = require('./uploads')

const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: true });



const pool = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "root",
    database: "nyblecraft",
    password: "Zhenyarulit123"
});

app.set("view engine", "hbs");

// получение списка пользователей
app.get("/", function (req, res) {
    pool.query("SELECT * FROM user", function (err, data) {
        if (err) return console.log(err);
        res.render("index.hbs", {
            user: data
        });
    });
});
// возвращаем форму для добавления данных
app.get("/create", function (req, res) {
    res.render("create.hbs");
});
// получаем отправленные данные и добавляем их в БД 
app.post("/create", urlencodedParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const image = req.file
    const binImage = new Buffer.alloc(255, image, 'base64');
    console.log(binImage)
    pool.query("INSERT INTO user (firstName, lastName) VALUES (?,?)", [firstName, lastName], function (err, data) {
        if (err) return console.log(err);
        res.redirect("/");
    });
});

// получем userid редактируемого пользователя, получаем его из бд и отправлям с формой редактирования
app.get("/edit/:userid", function (req, res) {
    const userid = req.params.userid;
    pool.query("SELECT * FROM user WHERE userid=?", [userid], function (err, data) {
        if (err) return console.log(err);
        res.render("edit.hbs", {
            user: data[0]
        });
    });
});
// получаем отредактированные данные и отправляем их в БД
app.post("/edit", urlencodedParser,upload.single('image'), function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    let image = req.file
    console.log(image)
    let binaryImage = fs.readFileSync(__dirname + `\\${image.path}`)
    let base64img = binaryImage.toString('base64')
    const bufferValue = Buffer.from(base64img,"base64");
    
    console.log(bufferValue)
    
    pool.query("UPDATE user SET firstName=?, lastName=?, image=? WHERE firstName=?", [firstName, lastName, base64img, firstName], function (err, data) {
        if (err) return console.log(err);
        res.redirect("/");
    });
});

// получаем userid удаляемого пользователя и удаляем его из бд
app.post("/delete/:userid", function (req, res) {

    const userid = req.params.userid;
    pool.query("DELETE FROM user WHERE userid=?", [userid], function (err, data) {
        if (err) return console.log(err);
        res.redirect("/");
    });
});

app.get('/find', (req, res) => {
    res.render('find')
})

app.post('/find', urlencodedParser, async (req, res) => {
        const firstName = req.body.firstName;

    console.log(firstName)
        pool.query("SELECT * FROM user WHERE firstName=?", [firstName], (err, data) => {
            console.log(data)
            pdf.create(pdfTemplate(data[0])).toBuffer(function(err, buffer){
                console.log('This is a buffer:', Buffer.isBuffer(buffer));
                console.log(buffer.toString('base64'))
                
                    pool.query("UPDATE user SET pdf=? WHERE firstName=?", [buffer.toString('base64'), firstName], function (err, data) {
                        if (err) return console.log(err);
                    })
                res.send({status: 'all is ok'})
              });
               
    })
})

app.listen(3000, function () {
    console.log("Сервер ожидает подключения...");
});