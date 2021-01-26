/*jshint esversion: 8*/

const Article = require("../models/Article");
const fs = require("fs");

const article_details = (req, res) => {
    const id = req.params.id;
    // SELECT `title`, `introduction`, `content` FROM `Articles` AS `Article` WHERE `Article`.`id` = '1';
    Article.findAll({
        attributes: [ "title", "introduction", "content" ], 
        where: { id: id } 
    })
    .then(result => {
        res.render("article", { title: result[0].title, article: result[0] });
    })
    .catch(err => {
        console.log(err);
    });
};

const article_create = (req, res) => {
    const { musicMovieRadio, title, introduction, content, editorId } = req.body;
    const imagePath = "/images/articles/" + req.file.filename;
    console.log(imagePath);

    try {
        // INSERT INTO `Articles` (`id`,`category`,`title`,`introduction`,`content`,`image`,`editorId`,`createdAt`,`updatedAt`) 
        // VALUES (DEFAULT,?,?,?,?,?,?,?,?);
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

const article_update = async (req, res) => {
    const { id, musicMovieRadio, title, introduction, content } = req.body;
    // SELECT `id`, `image` FROM `Articles` AS `Article` WHERE `Article`.`id` = '1';
    const articles = await Article.findAll({
        attributes: [ "id", "image" ],
        where: { id: id }
    });
    const articleToBeUpdated = articles[0];

    console.log(req.file);

    let imagePath; 
    if (req.file) {
        imagePath = "/images/articles/" + req.file.filename;
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
            imagePath = "/images/articles/" + req.file.filename;
            // UPDATE `Articles` SET `category`=?,`title`=?,`introduction`=?,`content`=?,`image`=?,`updatedAt`=? WHERE `id` = ?
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
            // UPDATE `Articles` SET `category`=?,`title`=?,`introduction`=?,`content`=?,`updatedAt`=? WHERE `id` = ?
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
    // DELETE FROM `Articles` WHERE `id` = '1'
    Article.destroy({ 
        where: { id: id }
    })
    .then(result => {
        res.json({ redirect: "/" });
    })
    .catch(err => { console.log(err); });
};

module.exports = {
    article_details,
    article_create,
    article_update,
    article_delete
};