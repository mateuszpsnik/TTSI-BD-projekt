/*jshint esversion:6*/

const Sequelize = require("sequelize");
const sequelize = require("../connection");
const Editor = require("./Editor");
const User = require("./User");
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
    editorId: Sequelize.INTEGER(11),
    userId: Sequelize.INTEGER(11),
    accepted: Sequelize.BOOLEAN
});

Editor.hasMany(MovieReview, { foreignKey: "editorId" });
MovieReview.belongsTo(Editor, { foreignKey: "editorId" });
User.hasMany(MovieReview, { foreignKey: "userId" });
MovieReview.belongsTo(User, { foreignKey: "userId" });
Movie.hasMany(MovieReview, { foreignKey: "movieId" });
MovieReview.belongsTo(Movie, { foreignKey: "movieId" });

module.exports = MovieReview;