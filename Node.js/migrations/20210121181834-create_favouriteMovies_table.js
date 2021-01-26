/*jshint esversion:8*/
/*jshint node:true*/
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {   
    await queryInterface.createTable("favouritemovies", { 
      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      // movieId: {
      //   type: Sequelize.INTEGER(11),
      //   onDelete: "CASCADE"
      // },
      // userId: {
      //   type: Sequelize.INTEGER(11),
      //   onDelete: "CASCADE"
      // },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("favouritemovies");
  }
};