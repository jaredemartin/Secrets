
//Add dotenv
require ('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
//Add mongoose
const mongoose = require("mongoose");
//Add mongoose-encryption
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

//Connect mongoose to mongoDB and create database userDB
mongoose.connect("mongodb://localhost:27017/userDB", { useUnifiedTopology: true, useNewUrlParser: true });

//Start setup user database
//User schema
//Change basic schema into a full mongoose schema by addinf new mongoose.schedma and parenthesis
const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});
//Define secret for encryption
//Move const secret to .env

//Add plugin from mongoose to encrypt specific field of DB in this case, password
//Modify "secret: secret,"" to incorporare .env
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

//User model
const User = new mongoose.model("User", userSchema);

//End setup user database

//Start app.get
app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

//End app.get

//Start register route
app.post("/register", function(req, res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err){
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });

});
//End register route

//Start login route
app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  //Check username and password against userDB
  User.findOne({email: username}, function(err, foundUser){
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
//End login route


app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
