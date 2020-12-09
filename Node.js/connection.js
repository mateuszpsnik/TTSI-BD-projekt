/*jshint esversion: 6*/

const { seq } = require("async");
const Sequelize = require("sequelize");

const sequelize = new Sequelize("ttsi", "root", "", {
    host: "localhost",
    dialect: "mysql"
});

module.exports = sequelize;
global.sequelize = sequelize;