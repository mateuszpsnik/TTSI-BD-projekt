/*jshint esversion: 8*/

const Admin = require("../models/Admin");
const Article = require("../models/Article");
const jwt = require("jsonwebtoken");

const handleErrors = (err) => {
    if (err.message === "incorrect password") {
        return "Nieprawidłowe hasło";
    }

    if (err.message.includes("Validation error")) {
        return err.errors[0].message;
    }
};

const maxExpirationTime = 60 * 60; // an hour

const createToken = (id) => {
    return jwt.sign({ id }, "some admin secret", { 
        expiresIn: maxExpirationTime
    });
};

module.exports.admin_index = (req, res) => {
    res.render("admin/index", { title: "Panel administracyjny" });
};

module.exports.articles_index = (req, res) => {
    Article.findAll()
    .then((result) => {
        res.render("admin/articlesIndex", { title: "Wszystkie artykuły", articles: result });
    })
    .catch((err) => {
        console.log(err);
    });
};

module.exports.articles_edit = (req, res) => {
    const id = req.params.id;
    Article.findAll({ where: { id: id } })
    .then(result => {
        res.render("admin/articlesEdit", { title: result[0].title, article: result[0] });
    })
    .catch(err => {
        console.log(err);
    });
};

module.exports.signup_post = async (req, res) => {
    const { password } = req.body;

    try {
        const admin = await Admin.create({ password });
        const token = createToken(admin.id);
        res.cookie("jwtAdmin", token, { httpOnly: true, maxAge: maxExpirationTime * 1000 });
        res.status(201).json(admin.id);
    }
    catch (err) {
        const error = handleErrors(err);
        res.status(400).json({ error, err });
    }
};

module.exports.signup_get = (req, res) => {
    res.render("admin/signup", { title: "Zarejestruj admina" });
};

module.exports.login_get = (req, res) => {
    res.render("admin/login", { title: "Zaloguj się"});
};

module.exports.login_post = async (req, res) => {
    const { password } = req.body;
    
    try {
        const admin = await Admin.login(password);
        const token = createToken(admin.id);
        res.cookie("jwtAdmin", token, { httpOnly: true, maxAge: maxExpirationTime * 1000 });
        res.status(200).json({ admin: admin.id });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};

module.exports.logout_get = (req, res) => {
    res.cookie("jwtAdmin", "", { maxAge: 1 });
    res.redirect("/");
};