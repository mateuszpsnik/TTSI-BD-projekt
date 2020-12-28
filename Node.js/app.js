/*jshint esversion: 8*/

const { render } = require("ejs");
const express = require("express");

const app = express();
const path = require("path");
const articlesRoutes = require("./routes/articlesRoutes");
const authRoutes = require("./routes/authRoutes");
const Article = require("./models/Article");
const cookieParser = require("cookie-parser");

// connection with the database
require("./connection");

app.set("view engine", "ejs");

// middleware & static files
app.listen("3000");
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => { 
    Article.findAll()
    .then((result) => {
        res.render("index", { title: "Muzyka i film - Strona główna", articles: result });
    })
    .catch((err) => {
        console.log(err);
    });
});

// routes
app.use(authRoutes);
app.use("/articles", articlesRoutes);

//cookies
app.get("/set-cookies", (req, res) => {
    res.cookie("new user", false);

    res.send("you got the cookies!"); 
});

app.get("/read-cookies", (req, res) => {
    const cookies = req.cookies;

    res.json(cookies);
});