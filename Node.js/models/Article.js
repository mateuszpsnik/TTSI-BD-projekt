/*jshint esversion:6*/

const Sequelize = require("sequelize");
const sequelize = require("../connection");
const Editor = require("./Editor");

const Article = sequelize.define("Article", {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    category: {
        type: Sequelize.STRING,
        allowNull: false
    },
    title: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
    },
    introduction: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    content: Sequelize.TEXT,
    image: Sequelize.STRING,
    editorId: Sequelize.INTEGER(11)
});

Editor.hasMany(Article, { foreignKey: "editorId" });
Article.belongsTo(Editor, { onDelete: "cascade", foreignKey: "editorId", hooks: true });

module.exports = Article;