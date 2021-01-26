/*jshint esversion:6*/

const Sequelize = require("sequelize");
const sequelize = require("../connection");
const Movie = require("./Movie");
const User = require("./User");

const FavouriteMovie = sequelize.define("FavouriteMovie", {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    movieId: Sequelize.INTEGER(11),
    userId: Sequelize.INTEGER(11)
});

Movie.hasMany(FavouriteMovie, { foreignKey: "movieId" });
FavouriteMovie.belongsTo(Movie, { onDelete: "CASCADE", foreignKey: "movieId", hooks: true });
User.hasMany(User, { foreignKey: "userId" });
FavouriteMovie.belongsTo(User, { onDelete: "CASCADE", foreignKey: "userId", hooks: true });

module.exports = FavouriteMovie;