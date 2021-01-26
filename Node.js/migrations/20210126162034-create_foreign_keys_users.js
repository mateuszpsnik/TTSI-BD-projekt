/*jshint esversion:8*/
/*jshint node:true*/
'use strict';

// users foreign keys

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      "MovieRatings", 
      "userId", 
      {
        type: Sequelize.INTEGER(11),
        references: {
          model: "Users",
          key: "id"
        },
        onDelete: "CASCADE"
      }
    );
    await queryInterface.addColumn(
      "FavouriteMovies", 
      "userId", 
      {
        type: Sequelize.INTEGER(11),
        references: {
          model: "Users",
          key: "id"
        },
        onDelete: "CASCADE"
      }
    );
    await queryInterface.addColumn(
      "MovieReviews", 
      "userId", 
      {
        type: Sequelize.INTEGER(11),
        references: {
          model: "Users",
          key: "id"
        },
        onDelete: "CASCADE"
      }
    );
    await queryInterface.addColumn(
      "AlbumRatings", 
      "userId", 
      {
        type: Sequelize.INTEGER(11),
        references: {
          model: "Users",
          key: "id"
        },
        onDelete: "CASCADE"
      }
    );
    await queryInterface.addColumn(
      "Favouritealbums", 
      "userId", 
      {
        type: Sequelize.INTEGER(11),
        references: {
          model: "Users",
          key: "id"
        },
        onDelete: "CASCADE"
      }
    );
    await queryInterface.addColumn(
      "albumReviews", 
      "userId", 
      {
        type: Sequelize.INTEGER(11),
        references: {
          model: "Users",
          key: "id"
        },
        onDelete: "CASCADE"
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      "MovieRatings",
      "userId"
    );
    await queryInterface.removeColumn(
      "FavouriteMovies",
      "userId"
    );
    await queryInterface.removeColumn(
      "MovieReviews",
      "userId"
    );
    await queryInterface.removeColumn(
      "albumRatings",
      "userId"
    );
    await queryInterface.removeColumn(
      "Favouritealbums",
      "userId"
    );
    await queryInterface.removeColumn(
      "albumReviews",
      "userId"
    );
  }
};
