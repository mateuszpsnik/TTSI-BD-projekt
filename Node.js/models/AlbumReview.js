/*jshint esversion:6*/

const Sequelize = require("sequelize");
const sequelize = require("../connection");
const Editor = require("./Editor");

const AlbumReview = sequelize.define("AlbumReview", {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    albumId: Sequelize.INTEGER(11),
    introduction: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    content: Sequelize.TEXT,
    points: Sequelize.INTEGER,
    editorId: Sequelize.INTEGER(11)
});

Editor.hasMany(AlbumReview, { foreignKey: "editorId" });
AlbumReview.belongsTo(Editor, { foreignKey: "editorId" });
Album.hasMany(AlbumReview, { foreignKey: "albumId" });
AlbumReview.belongsTo(Album, { foreignKey: "albumId" });

module.exports = AlbumReview;