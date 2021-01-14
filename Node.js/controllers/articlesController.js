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
    console.log(req.body);
    const { musicMovieRadio, title, introduction, content, editorId } = req.body;
    const imagePath = "/images/articles/" + req.file.filename;
    console.log(imagePath);

    try {
        const article = Article.create({ category: musicMovieRadio,
            title: title, introduction: introduction, 
            content: content, image: imagePath, editorId: editorId
        });

        res.status(201).json({ article: article.id });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ err });
    }
};

article_update = async (req, res) => {
    const { id, musicMovieRadio, title, introduction, content } = req.body;

    const articles = await Article.findAll({ where: { id: id }});
    const articleToBeUpdated = articles[0];

    console.log(req.file);

    const imagePath = "/images/articles/" + req.file.filename;
    if (req.file) {
        console.log(imagePath);
        fs.unlinkSync("public" + articleToBeUpdated.image, (err) => {
            if (err) {
                throw Error(err);
            }
        });
    }
    

    try {
        let article;
        if (req.file) {
            article = Article.update({ 
                category: musicMovieRadio,
                title: title,
                introduction: introduction,
                content: content,
                image: imagePath
            }, {
                where: { id: id }
            });
        } else {
            article = Article.update({ 
                category: musicMovieRadio,
                title: title,
                introduction: introduction,
                content: content
            }, {
                where: { id: id }
            });
        }
        
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
        res.json({ redirect: "/admin/articles" });
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