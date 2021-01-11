/*jshint esversion:6*/

const Sequelize = require("sequelize");
const sequelize = require("../connection");

const Movie = sequelize.define("Movie", {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    director: {
        type: Sequelize.STRING,
        allowNull: false
    },
    genre: {
        type: Sequelize.STRING,
        allowNull: false
    },
    year: Sequelize.INTEGER,
    poster: Sequelize.STRING
});

module.exports = Movie;