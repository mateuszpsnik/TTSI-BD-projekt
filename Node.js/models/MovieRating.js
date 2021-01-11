/*jshint esversion:6*/

const Sequelize = require("sequelize");
const sequelize = require("../connection");
const Movie = require("./Movie");
const User = require("./User");

const MovieRating = sequelize.define("MovieRating", {
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
    movieId: Sequelize.INTEGER(11),
    userId: Sequelize.INTEGER(11)
});

Movie.hasMany(MovieRating, { foreignKey: "movieId" });
MovieRating.belongsTo(Movie, { foreignKey: "movieId" });
User.hasMany(MovieRating, { foreignKey: "userId" });
MovieRating.belongsTo(User, { foreignKey: "userId" });

module.exports = MovieRating;