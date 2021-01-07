/*jshint esversion:8*/

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    const tokenAdmin = req.cookies.jwtAdmin;

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
                let user = await User.findAll({
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
                let admin = await Admin.findAll({
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
    requireAuth, 
    requireAdminAuth, 
    checkUser,
    checkAdmin 
};