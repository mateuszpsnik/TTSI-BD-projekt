/*jshint esversion: 8*/

const { render } = require("ejs");
const express = require("express");
const app = express();
const path = require("path");

require("./connection");

app.set("view engine", "ejs");

app.listen("3000");
app.use(express.static(__dirname + "/public"));

const Article = require("./models/Article");

app.get("/", (req, res) => { 
    res.redirect("/articles");
});

app.get("/articles", (req, res) => {
    Article.findAll()
    .then((result) => {
        res.render("index", { title: "Wszystkie artykuły", articles: result });
    })
    .catch((err) => {
        console.log(err);
    });
});

app.get("/articles/:id", (req, res) => {
    const id = req.params.id;
    Article.findAll({ where: { id: id } })
    .then(result => {
        res.render("article", { title: result[0].title, article: result[0] });
    })
    .catch(err => {
        console.log(err);
    });
});
