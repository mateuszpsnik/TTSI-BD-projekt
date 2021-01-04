/*jshint esversion: 8*/

const User = require("../models/User");

module.exports.user_details = (req, res) => {
    const id = req.params.id;
    User.findAll({ where: { id: id } })
    .then(result => {
        res.render("user", { title: result[0].title, user: result[0] });
    })
    .catch(err => {
        console.log(err);
    });
};

module.exports.user_edit = (req, res) => {
    res.redirect("/");
};