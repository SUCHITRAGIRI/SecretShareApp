require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
//const encrypt = require('mongoose-encryption'); 
//const md5 = require('md5');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

//mongoDB connection
mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true });

//create schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// var secret = process.env.SOME_LONG_UNGUESSABLE_STRING;
// userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

//create model
const User = new mongoose.model("User", userSchema);


app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});


app.post("/register", (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
        newUser.save((err) => {
            if (!err) {
                console.log("Successfully saved");
                res.render("secrets");
            } else {
                console.log(err);
            }
        });
    });

});

app.post("/login", (req, res) => {
        const username = req.body.username;
        const password = req.body.password;
        User.findOne({ email: username }, (err, foundUser) => {
            if (err) {
                console.log(err);
            } else {
                bcrypt.compare(password, foundUser.password, function(err, result) {
                    if(result == true)res.render("secrets");
                });
                   
                }
        });
    });


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});