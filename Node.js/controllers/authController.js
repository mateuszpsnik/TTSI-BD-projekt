/*jshint esversion:8*/

module.exports.signup_get = (req, res) => {
    res.render("signup", { title: "Zarejestruj się" });
};

module.exports.login_get = (req, res) => {
    res.render("login", { title: "Zaloguj się" });
};

module.exports.signup_post = (req, res) => {
    res.send("new signup");
};

module.exports.login_post = (req, res) => {
    res.send("user login");
};