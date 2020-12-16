/*jshint esversion: 8*/

const Article = require("../models/Article");

const articles_index = (req, res) => {
    Article.findAll()
    .then((result) => {
        res.render("index", { title: "Wszystkie artykuły", articles: result });
    })
    .catch((err) => {
        console.log(err);
    });
};

const article_details = (req, res) => {
    const id = req.params.id;
    Article.findAll({ where: { id: id } })
    .then(result => {
        res.render("article", { title: result[0].title, article: result[0] });
    })
    .catch(err => {
        console.log(err);
    });
};

module.exports = {
    articles_index,
    article_details
};