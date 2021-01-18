/*jshint esversion:6*/

const Sequelize = require("sequelize");
const sequelize = require("../connection");
const Editor = require("./Editor");
const Movie = require("./Movie");

const MovieReview = sequelize.define("MovieReview", {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    movieId: Sequelize.INTEGER(11),
    introduction: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    content: Sequelize.TEXT,
    points: Sequelize.INTEGER,
    editorId: Sequelize.INTEGER(11)
});

Editor.hasMany(MovieReview, { foreignKey: "editorId" });
MovieReview.belongsTo(Editor, { foreignKey: "editorId" });
Movie.hasMany(MovieReview, { foreignKey: "movieId" });
MovieReview.belongsTo(Movie, { foreignKey: "movieId" });

module.exports = MovieReview;