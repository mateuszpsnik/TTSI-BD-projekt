/*jshint esversion: 8*/

const Article = require("../models/Article");

const editor_index = (req, res) => {
    res.render("editor", { title: "Panel redaktorski" });
};

module.exports = {
    editor_index
};