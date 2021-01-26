/*jshint esversion:6*/

const Sequelize = require("sequelize");
const sequelize = require("../connection");
const Editor = require("./Editor");
const User = require("./User");
const Album = require("./Album");

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
    editorId: Sequelize.INTEGER(11),
    userId: Sequelize.INTEGER(11),
    accepted: Sequelize.BOOLEAN
});

Editor.hasMany(AlbumReview, { foreignKey: "editorId" });
AlbumReview.belongsTo(Editor, { onDelete: "CASCADE", foreignKey: "editorId", hooks: true });
User.hasMany(AlbumReview, { foreignKey: "userId" });
AlbumReview.belongsTo(User, { onDelete: "CASCADE", foreignKey: "userId", hooks: true });
Album.hasMany(AlbumReview, { foreignKey: "albumId" });
AlbumReview.belongsTo(Album, { onDelete: "CASCADE", foreignKey: "albumId", hooks: true });

module.exports = AlbumReview;