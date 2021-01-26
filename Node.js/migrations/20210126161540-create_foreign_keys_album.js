/*jshint esversion:8*/
/*jshint node:true*/
'use strict';

// albums foreign keys

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      "AlbumRatings", 
      "albumId", 
      {
        type: Sequelize.INTEGER(11),
        references: {
          model: "albums",
          key: "id"
        },
        onDelete: "CASCADE"
      }
    );
    await queryInterface.addColumn(
      "Favouritealbums", 
      "albumId", 
      {
        type: Sequelize.INTEGER(11),
        references: {
          model: "albums",
          key: "id"
        },
        onDelete: "CASCADE"
      }
    );
    await queryInterface.addColumn(
      "albumReviews", 
      "albumId", 
      {
        type: Sequelize.INTEGER(11),
        references: {
          model: "albums",
          key: "id"
        },
        onDelete: "CASCADE"
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      "albumRatings",
      "albumId"
    );
    await queryInterface.removeColumn(
      "Favouritealbums",
      "albumId"
    );
    await queryInterface.removeColumn(
      "albumReviews",
      "albumId"
    );
  }
};
