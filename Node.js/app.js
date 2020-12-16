/*jshint esversion: 8*/

const { render } = require("ejs");
const express = require("express");
const app = express();
const path = require("path");
const articlesRoutes = require("./routes/articlesRoutes");

// connection with the database
require("./connection");

app.set("view engine", "ejs");

// middleware & static files
app.listen("3000");
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => { 
    res.redirect("/articles");
});

app.use("/articles", articlesRoutes);