/*jshint esversion:6*/

const Sequelize = require("sequelize");
const sequelize = require("../connection");

const Album = sequelize.define("Album", {
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
    artist: {
        type: Sequelize.STRING,
        allowNull: false
    },
    genre: {
        type: Sequelize.STRING,
        allowNull: false
    },
    year: Sequelize.INTEGER,
    cover: Sequelize.STRING
});

module.exports = Album;