/*jshint esversion:8*/
/*jshint node:true*/
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("movie_reviews", {
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
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("movie_reviews");
  }
};
