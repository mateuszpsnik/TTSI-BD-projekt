/*jshint esversion: 8*/

const { render } = require("ejs");
const express = require("express");

const app = express();
const path = require("path");
const articlesRoutes = require("./routes/articlesRoutes");
const authRoutes = require("./routes/authRoutes");
const Article = require("./models/Article");

// connection with the database
require("./connection");

app.set("view engine", "ejs");

// middleware & static files
app.listen("3000");
app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => { 
    Article.findAll()
    .then((result) => {
        res.render("index", { title: "Muzyka i film - Strona główna", articles: result });
    })
    .catch((err) => {
        console.log(err);
    });
});

app.use(authRoutes);
app.use("/articles", articlesRoutes);