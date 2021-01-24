/*jshint esversion:6*/

const Sequelize = require("sequelize");
const sequelize = require("../connection");
const Album = require("./Album");
const User = require("./User");

const FavouriteAlbum = sequelize.define("FavouriteAlbum", {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    albumId: Sequelize.INTEGER(11),
    userId: Sequelize.INTEGER(11)
});

Album.hasMany(FavouriteAlbum, { foreignKey: "albumId" });
FavouriteAlbum.belongsTo(Album, { foreignKey: "albumId" });
User.hasMany(User, { foreignKey: "userId" });
FavouriteAlbum.belongsTo(User, { foreignKey: "userId" });

module.exports = FavouriteAlbum;