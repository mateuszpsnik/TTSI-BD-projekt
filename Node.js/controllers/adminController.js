/*jshint esversion: 8*/

const Admin = require("../models/Admin");
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
    res.render("adminIndex", { title: "Panel administracyjny" });
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
    res.render("adminSignup", { title: "Zarejestruj admina" });
};

module.exports.login_get = (req, res) => {
    res.render("adminLogin", { title: "Zaloguj się"});
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