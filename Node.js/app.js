const express = require("express");
const app = express();
const path = require("path");

app.set("view engine", "ejs");

app.listen("3000");
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => { 
    res.render("index");
});