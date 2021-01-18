/*jshint esversion:8*/
/*jshint node:true*/
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("albumreviews", {
      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      albumId: Sequelize.INTEGER(11),
      introduction: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      content: Sequelize.TEXT,
      points: Sequelize.INTEGER,
      editorId: Sequelize.INTEGER(11),
      userId: Sequelize.INTEGER(11),
      accepted: Sequelize.BOOLEAN,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("albumreviews");
  }
};
