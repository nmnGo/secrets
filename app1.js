//jshint esversion:6
require('dotenv').config();
//if we put our resources online then our api and secrets ,must not 
//be public like git or anywhere else they will be git ignore

const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose"); //mongoDb connect
const encrypt = require("mongoose-encryption") // encryption package by mongoose

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({ //new mongoose schema is added so that it is under the schema of mongoose encryption 
    email: String,
    password: String
});

// const secret = "ThisIsOurSecret"; this is now in env file

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);


app.get("/", (req, res) => { res.render("home"); });
app.get("/login", (req, res) => { res.render("login"); });
app.get("/register", (req, res) => { res.render("register"); });

app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save((err) => {
        if (err) {
            console.log("An error has Occured ");
        } else {
            res.render("secrets");
        }
    });
});


app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }, (err, foundUser) => {
        if (err) {
            console.log("An error has Occured ");
        } else {
            if (foundUser) {
                if (foundUser.password === password)
                    res.render("secrets");
            }
        }
    });



});

app.listen(3000, console.log("Server at port 3000"));