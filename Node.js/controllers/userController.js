/*jshint esversion: 8*/

const User = require("../models/User");
const fs = require("fs");
const { handleErrors } = require("./authController");
const bcrypt = require("bcrypt");

const user_details = (req, res) => {
    const id = req.params.id;
    User.findAll({ where: { id: id } })
    .then(result => {
        res.render("user/details", { title: result[0].title, user: result[0] });
    })
    .catch(err => {
        console.log(err);
    });
};

const user_edit = (req, res) => {
    res.render("user/edit", { title: "Edytuj profil" });
};

const user_update = async (req, res) => {
    const { id, username, email, password, checkboxPassword,
         newPassword } = req.body;

    const users = await User.findAll({ where: { id: id } });
    const userToBeUpdated = users[0];

    console.log(req.file, userToBeUpdated);

    const imagePath = "/images/users/" + req.file.filename;
    if (req.file) {
        console.log(imagePath);
        fs.unlinkSync("public" + userToBeUpdated.image, (err) => {
            if (err) {
                throw Error(err);
            }
        });
    }

    try {
        const auth = await bcrypt.compare(password, userToBeUpdated.password);

        if (!auth) {
            throw Error("incorrect password");
        }

        if (req.file && checkboxPassword) {
            await User.update({
                username: username,
                email: email,
                password: newPassword,
                image: imagePath
            }, {
                where: { id: id }
            });
        }
        else if (req.file && !checkboxPassword) {
            await User.update({
                username: username,
                email: email,
                image: imagePath
            }, {
                where: { id: id }
            });
        }
        else if (!req.file && checkboxPassword) {
            await User.update({
                username: username,
                email: email,
                password: newPassword
            }, {
                where: { id: id }
            });
        }
        else {
            await User.update({
                username: username,
                email: email
            }, {
                where: { id: id }
            });
        }

        res.status(200).json({ success: true });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};

module.exports = {
    user_details,
    user_edit,
    user_update
};