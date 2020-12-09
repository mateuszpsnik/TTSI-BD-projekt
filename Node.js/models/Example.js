/*jshint esversion:6*/

const Sequelize = require("sequelize");

module.exports = sequelize.define("Example", {  
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    example_text: Sequelize.STRING(50),
});