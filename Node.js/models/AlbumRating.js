/*jshint esversion:6*/

const Sequelize = require("sequelize");
const sequelize = require("../connection");
const Album = require("./Album");
const User = require("./User");

const AlbumRating = sequelize.define("AlbumRating", {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    points: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    albumId: Sequelize.INTEGER(11),
    userId: Sequelize.INTEGER(11)
});

Album.hasMany(AlbumRating, { foreignKey: "albumId" });
AlbumRating.belongsTo(Album, { onDelete: "CASCADE", foreignKey: "albumId", hooks: true });
User.hasMany(AlbumRating, { foreignKey: "userId" });
AlbumRating.belongsTo(User, { onDelete: "CASCADE", foreignKey: "userId", hooks: true });

module.exports = AlbumRating;