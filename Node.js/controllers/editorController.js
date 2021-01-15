/*jshint esversion: 8*/

const Editor = require("../models/Editor");
const { handleErrors } = require("./authController");
const jwt = require("jsonwebtoken");

const maxExpirationTime = 24 * 60 * 60; // a day

const createToken = (id) => {
    return jwt.sign({ id }, "some editor secret", {
        expiresIn: maxExpirationTime
    });
};

const editor_index = (req, res) => {
    res.render("editor/index", { title: "Panel redaktorski" });
};

const signup_post = async (req, res) => {
    const { name, email, password } = req.body;

    try {
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
    editor_index,
    signup_post,
    login_get,
    login_post,
    logout_get
};