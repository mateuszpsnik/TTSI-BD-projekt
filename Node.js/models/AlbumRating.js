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
AlbumRating.belongsTo(Album, { foreignKey: "albumId" });
User.hasMany(AlbumRating, { foreignKey: "userId" });
AlbumRating.belongsTo(User, { foreignKey: "userId" });

module.exports = AlbumRating;