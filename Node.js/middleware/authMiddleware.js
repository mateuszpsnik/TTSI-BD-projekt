/*jshint esversion:8*/

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");
const Editor = require("../models/Editor");

const requireUserAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, "some example secret", (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect("/login");
            }
            else {
                console.log(decodedToken);
                next();
            }
        });
    }
    else {
        res.redirect("/login");
    }
};

const requireEditorAuth = (req, res, next) => {
    const token = req.cookies.jwtEditor;

    if (token) {
        jwt.verify(token, "some editor secret", (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect("/editor/login");
            }
            else {
                console.log(decodedToken);
                next();
            }
        });
    }
    else {
        res.redirect("/editor/login");
    }
};

const requireAdminAuth = (req, res, next) => {
    const token = req.cookies.jwtAdmin;

    if (token) {
        jwt.verify(token, "some admin secret", (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect("/admin/login");
            }
            else {
                console.log(decodedToken);
                next();
            }
        });
    }
    else {
        res.redirect("/admin/login");
    }
};

const requireAdminOrEditorAuth = (req, res, next) => {
    const tokenEditor = req.cookies.jwtEditor;
    const tokenAdmin = req.cookies.jwtAdmin;

    if (tokenEditor) {
        jwt.verify(tokenEditor, "some editor secret", (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect("/editor/login");
            }
            else {
                console.log(decodedToken);
                next();
            }
        });
    }
    else if (tokenAdmin) {
        jwt.verify(tokenAdmin, "some admin secret", (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect("/admin/login");
            }
            else {
                console.log(decodedToken);
                next();
            }
        });
    }
    else {
        res.redirect("/editor/login");
    }
};

const requireAnyAuth = (req, res, next) => {
    const tokenUser = req.cookies.jwt;
    const tokenEditor = req.cookies.jwtEditor;
    const tokenAdmin = req.cookies.jwtAdmin;

    if (tokenUser) {
        jwt.verify(tokenUser, "some example secret", (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect("/login");
            }
            else {
                console.log(decodedToken);
                next();
            }
        });
    }
    else if (tokenEditor) {
        jwt.verify(tokenEditor, "some editor secret", (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect("/editor/login");
            }
            else {
                console.log(decodedToken);
                next();
            }
        });
    }
    else if (tokenAdmin) {
        jwt.verify(tokenAdmin, "some admin secret", (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect("/admin/login");
            }
            else {
                console.log(decodedToken);
                next();
            }
        });
    }
    else {
        res.redirect("/login");
    }
};

// check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, "some example secret", async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            }
            else {
                console.log(decodedToken);
                // SELECT `id`, `username`, `email`, `password`, `image` FROM `Users` AS `User` WHERE `User`.`id` = 1;
                let user = await User.findAll({
                    attributes: {
                        exclude: [ "userId", "createdAt", "updatedAt" ]
                    },
                    where: { id: decodedToken.id }
                }); 
                res.locals.user = user[0];
                next();
            }
        });
    }
    else {
        res.locals.user = null;
        next();
    }
};

const checkEditor = (req, res, next) => {
    const token = req.cookies.jwtEditor;

    if (token) {
        jwt.verify(token, "some editor secret", async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.editor = null;
                next();
            }
            else {
                console.log(decodedToken);
                // SELECT `id`, `name`, `email`, `password`, `image` FROM `Editors` AS `Editor` WHERE `Editor`.`id` = 1;
                let editor = await Editor.findAll({ 
                    attributes: {
                        exclude: [ "editorId", "createdAt", "updatedAt" ]
                    },
                    where: { id: decodedToken.id } 
                });
                res.locals.editor = editor[0];
                next();
            }
        });
    }
    else {
        res.locals.editor = null;
        next();
    }
};

const checkAdmin = (req, res, next) => {
    const token = req.cookies.jwtAdmin;

    if (token) {
        jwt.verify(token, "some admin secret", async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.admin = null;
                next();
            }
            else {
                console.log(decodedToken);
                // SELECT `id`, `password` FROM `Admins` AS `Admin` WHERE `Admin`.`id` = 1;
                let admin = await Admin.findAll({
                    attributes: [ "id", "password" ],
                    where: { id: decodedToken.id }
                });
                res.locals.admin = admin[0];
                next();
            }
        });
    }
    else {
        res.locals.admin = null;
        next();
    }
};

module.exports = { 
    requireUserAuth, 
    requireEditorAuth,
    requireAdminAuth,
    requireAdminOrEditorAuth, 
    requireAnyAuth,
    checkUser,
    checkEditor,
    checkAdmin 
};