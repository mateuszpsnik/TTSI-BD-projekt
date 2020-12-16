/*jshint esversion:6*/

const Sequelize = require("sequelize");
require("../connection");

const Article = sequelize.define("Article", {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    introduction: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    content: Sequelize.TEXT,
    image: Sequelize.BLOB
});

module.exports = Article;