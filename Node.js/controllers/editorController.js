/*jshint esversion: 8*/

const Editor = require("../models/Editor");
const Article = require("../models/Article");
const AlbumReview = require("../models/AlbumReview");
const MovieReview = require("../models/MovieReview");
const { handleErrors } = require("./authController");
const jwt = require("jsonwebtoken");

const maxExpirationTime = 24 * 60 * 60; // a day

const createToken = (id) => {
    return jwt.sign({ id }, "some editor secret", {
        expiresIn: maxExpirationTime
    });
};

const getEditorId = (req) => {
    const token = req.cookies.jwtEditor;
    let editorId;

        if (token) {
            jwt.verify(token, "some editor secret", async (err, decodedToken) => {
                if (err) {
                    console.log(err.message);
                }
                else {
                    console.log("token", decodedToken);
                    editorId = decodedToken.id;
                    console.log("userId", editorId);
                }
            });
        }

    return editorId;
};

const editor_index = (req, res) => {
    res.render("editor/index", { title: "Panel redaktorski" });
};

const editor_articles = async (req, res) => {
    const editorId = getEditorId(req);
    // SELECT `id`, `image`, `title`, `introduction` FROM `Articles` AS `Article` WHERE `Article`.`editorId` = 1;
    await Article.findAll({
            attributes: [ "id", "image", "title", "introduction" ],
            where: { editorId: editorId }
        }
    )
    .then((result) => {
        res.render("editor/articles", { title: "Wszystkie artykuły", articles: result });
    })
    .catch((err) => {
        console.log(err);
    });
};

const edit_articles = async (req, res) => {
    const id = req.params.id;
    // SELECT `id`, `title`, `introduction`, `content` FROM `Articles` AS `Article` WHERE `Article`.`id` = '2';
    await Article.findAll({
        attributes: [ "id", "title", "introduction", "content" ],
        where: { id: id } })
    .then(result => {
        res.render("editor/editArticle", { title: "Edytuj artykuł", article: result[0] });
    })
    .catch(err => console.log(err));
};

const signup_post = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // INSERT INTO `Editors` (`id`,`name`,`email`,`password`,`createdAt`,`updatedAt`) 
        // VALUES (DEFAULT,?,?,?,?,?);
        const editor = await Editor.create({ name, email, password });
        res.status(201).json({ editor: editor.id });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};

const login_get = (req, res) => {
    res.render("editor/login", { title: "Zaloguj się" });
};

const login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const editor = await Editor.login(email, password);
        const token = createToken(editor.id);
        res.cookie("jwtEditor", token, { httpOnly: true, 
            maxAge: maxExpirationTime * 1000 });
        res.status(200).json({ editor: editor.id });
    }
    catch (err) {
        console.log(err);
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }

};

const logout_get = async (req, res) => {
    res.cookie("jwtEditor", "", { maxAge: 1 });
    res.redirect("/editor");
};

module.exports = {
    getEditorId,
    editor_index,
    editor_articles,
    edit_articles,
    signup_post,
    login_get,
    login_post,
    logout_get
};