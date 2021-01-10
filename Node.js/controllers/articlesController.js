/*jshint esversion: 8*/

const Article = require("../models/Article");
const fs = require("fs");

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

const article_create = (req, res) => {
    const { title, introduction, content } = req.body;
    const imagePath = "/images/articles/" + req.file.filename;
    console.log(imagePath);

    try {
        const article = Article.create({ title: title, introduction: introduction, 
            content: content, image: imagePath
        });

        res.status(201).json({ article: article.id });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ err });
    }
};

article_update = async (req, res) => {
    const { id, title, introduction, content } = req.body;
    const imagePath = "/images/articles/" + req.file.filename;
    console.log(imagePath);

    const articles = await Article.findAll({ where: { id: id }});
        const articleToBeUpdated = articles[0];
        fs.unlinkSync("public" + articleToBeUpdated.image, (err) => {
            if (err) {
                throw Error(err);
            }
        });

    try {

        const article = Article.update({ 
            title: title,
            introduction: introduction,
            content: content,
            image: imagePath
        }, {
            where: { id: id }
        });
        res.status(201).json({ article: article.id });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ err });
    }
};

const article_delete = (req, res) => {
    const id = req.params.id;

    Article.destroy({ 
        where: { id: id }
    })
    .then(result => {
        res.json({ redirect: "/articles" });
    })
    .catch(err => { console.log(err); });
};

module.exports = {
    articles_index,
    article_details,
    article_create,
    article_update,
    article_delete
};