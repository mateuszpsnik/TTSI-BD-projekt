/*jshint esversion:10*/

const User = require("../models/User");

// handle errors
const handleErrors = (err) => {
    let errors = { username: "", email: "", password: "" }; 

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

module.exports.signup_get = (req, res) => {
    res.render("signup", { title: "Zarejestruj się" });
};

module.exports.login_get = (req, res) => {
    res.render("login", { title: "Zaloguj się" });
};

module.exports.signup_post = async (req, res) => {
    const { username, email, password } = req.body;
    
    try {
        const user = await User.create({ username: username, email: email, 
            password: password });
        res.status(201).json(user);
    } 
    catch(err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};

module.exports.login_post = async (req, res) => {
    const { username, email, password } = req.body;
    console.log(username, email, password);
    res.send("user login");
};