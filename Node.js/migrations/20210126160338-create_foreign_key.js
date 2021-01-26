/*jshint esversion:8*/
/*jshint node:true*/
'use strict';

// movies foreign keys

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      "MovieRatings", 
      "movieId", 
      {
        type: Sequelize.INTEGER(11),
        references: {
          model: "Movies",
          key: "id"
        },
        onDelete: "CASCADE"
      }
    );
    await queryInterface.addColumn(
      "FavouriteMovies", 
      "movieId", 
      {
        type: Sequelize.INTEGER(11),
        references: {
          model: "Movies",
          key: "id"
        },
        onDelete: "CASCADE"
      }
    );
    await queryInterface.addColumn(
      "MovieReviews", 
      "movieId", 
      {
        type: Sequelize.INTEGER(11),
        references: {
          model: "Movies",
          key: "id"
        },
        onDelete: "CASCADE"
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      "MovieRatings",
      "movieId"
    );
    await queryInterface.removeColumn(
      "FavouriteMovies",
      "movieId"
    );
    await queryInterface.removeColumn(
      "MovieReviews",
      "movieId"
    );
  }
};
