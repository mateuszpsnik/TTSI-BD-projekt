/*jshint esversion: 8*/

const express = require("express");
const app = express();
const path = require("path");

require("./connection");

const data = require("./data");

(async () => {
    console.log(await data.articles());
})();

app.set("view engine", "ejs");

app.listen("3000");
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => { 
    res.render("index");
});
