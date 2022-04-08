//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const moongose = require("mongoose");
const encrypt = require("mongoose-encryption");
const { default: mongoose } = require("mongoose");

const app = express();


app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));

moongose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

const userScheme = new mongoose.Schema({
    email: String,
    password: String
});


userScheme.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] })

const User = new mongoose.model("USER", userScheme);

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }, function(err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets");
                }
            }
        }
    });
});

app.post("/register", function(req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save(function(err) {
        if (err) {
            console.log(err);
        }
        res.render("secrets");
    });
});



app.listen(process.env.PORTDB || process.env.PORT, function() {
    console.log("Server started on port " + process.env.PORTDB);
});