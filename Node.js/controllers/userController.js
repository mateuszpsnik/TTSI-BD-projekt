/*jshint esversion: 8*/

const User = require("../models/User");
const fs = require("fs");
const { handleErrors } = require("./authController");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getUserId = (req) => {
    const token = req.cookies.jwt;
    let userId;

        if (token) {
            jwt.verify(token, "some example secret", async (err, decodedToken) => {
                if (err) {
                    console.log(err.message);
                }
                else {
                    console.log("token", decodedToken);
                    userId = decodedToken.id;
                    console.log("userId", userId);
                }
            });
        }

    return userId;
};

const user_details = (req, res) => {
    const id = req.params.id;
    // SELECT `id`, `username`, `email`, `password`, `image` FROM `Users` AS `User` WHERE `User`.`id` = '1';
    User.findAll({
        attributes: {
            exclude: [ "createdAt", "updatedAt", "userId" ]
        },
        where: { id: id } 
    })
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
    const { id, username, email, checkboxPassword,
         newPassword } = req.body;

    //  SELECT `id`, `image` FROM `Users` AS `User` WHERE `User`.`id` = '1';
    const users = await User.findAll({
        attributes: [ "id", "image" ],
        where: { id: id } });
    const userToBeUpdated = users[0];

    let imagePath;
    if (req.file) {
        imagePath = "/images/users/" + req.file.filename;
        console.log(imagePath);
        fs.unlinkSync("public" + userToBeUpdated.image, (err) => {
            if (err) {
                throw Error(err);
            }
        });
    }

    try {
        if (req.file) {
            // UPDATE `Users` SET `username`=?,`email`=?,`password`=?,`image`=?,`updatedAt`=? WHERE `id` = ?
            await User.update({
                username: username,
                email: email,
                password: newPassword,
                image: imagePath
            }, {
                where: { id: id }
            });
        }
        else {
            // UPDATE `Users` SET `username`=?,`email`=?,`password`=?,`updatedAt`=? WHERE `id` = ?
            await User.update({
                username: username,
                email: email,
                password: newPassword
            }, {
                where: { id: id }
            });
        }

        res.status(200).json({ success: true });
    }
    catch (err) {
        console.log(err);
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};

const user_get_delete = async (req, res) => {
    res.render("user/delete", { title: "Usuń konto" });
};

const user_delete = async (req, res) => {
    const { id } = req.params;
    const { admin, password } = req.body;
    // SELECT `id`, `password` FROM `Users` AS `User` WHERE `User`.`id` = '2';
    const users = await User.findAll({
        attributes: [ "id", "password" ], 
        where: { id: id } 
    });

    try {
        if (!admin) {
            const auth = await bcrypt.compare(password, users[0].password);

            if (!auth) {
                throw Error("incorrect password");
            }
        }
        // DELETE FROM `Users` WHERE `id` = '2'
        await User.destroy({
            where: { id: id }
        });

        if (admin) {
            res.status(200).json({ redirect: "/admin/users" });
        }
        else {
            res.status(200).json({ redirect: "/" });
        }  
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ err });
    }

};

module.exports = {
    getUserId,
    user_details,
    user_edit,
    user_update,
    user_get_delete,
    user_delete
};