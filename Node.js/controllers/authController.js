/*jshint esversion:10*/

const User = require("../models/User");
const jwt = require("jsonwebtoken");

// handle errors
const handleErrors = (err) => {
    let errors = { username: "", email: "", password: "" }; 

    // incorrect email
    if (err.message === "incorrect email") {
        errors.email = "Nieprawidłowy adres e-mail";
    }

    if (err.message === "incorrect password") {
        errors.password = "Nieprawidłowe hasło";
    }

    // validation errors
    if (err.message.includes("Validation error")) {
        Object.values(err.errors).forEach(error => {
            if (error.message.includes("must be unique"))
                errors[error.path] = "Ta nazwa użytkownika bądź adres e-mail została " +
                     "już użyta";
            else
                errors[error.path] = error.message;
        });
    }

    return errors;
};

const maxExpirationTime = 7 * 24 * 60 * 60; // a week

const createToken = (id) => {
    return jwt.sign({ id }, "some example secret", { 
        expiresIn: maxExpirationTime
    });
};

const signup_get = (req, res) => {
    res.render("signup", { title: "Zarejestruj się" });
};

const login_get = (req, res) => {
    res.render("login", { title: "Zaloguj się" });
};

const signup_post = async (req, res) => {
    const { username, email, password } = req.body;
    console.log(username, email, password);
    const imagePath = "/images/users/" + req.file.filename;
    console.log(imagePath);
    
    try {
        const user = await User.create({ username, email, password, 
            image: imagePath });
        const token = createToken(user.id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxExpirationTime * 1000 });
        res.status(201).json({ user: user.id });
    } 
    catch(err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};

const login_post = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.login(email, password);
        const token = createToken(user.id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxExpirationTime * 1000 });
        res.status(200).json({ user: user.id });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};

const logout_get = (req, res) => {
    res.cookie("jwt", "", { maxAge: 1 });

    res.redirect("/");
};

module.exports = {
    handleErrors,
    signup_get,
    login_get,
    signup_post,
    login_post,
    logout_get
};