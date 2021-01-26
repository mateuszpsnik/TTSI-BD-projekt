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
FavouriteAlbum.belongsTo(Album, { onDelete: "CASCADE", foreignKey: "albumId", hooks: true });
User.hasMany(User, { foreignKey: "userId" });
FavouriteAlbum.belongsTo(User, { onDelete: "CASCADE", foreignKey: "userId", hooks: true });

module.exports = FavouriteAlbum;