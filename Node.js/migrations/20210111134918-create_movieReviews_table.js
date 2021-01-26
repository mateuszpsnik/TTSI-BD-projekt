/*jshint esversion:8*/
/*jshint node:true*/
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("moviereviews", {
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
      introduction: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      content: Sequelize.TEXT,
      points: Sequelize.INTEGER,
      editorId: {
        type: Sequelize.INTEGER(11),
        onDelete: "CASCADE"
      },
      // userId: {
      //   type: Sequelize.INTEGER(11),
      //   onDelete: "CASCADE"
      // },
      accepted: Sequelize.BOOLEAN,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("moviereviews");
  }
};
