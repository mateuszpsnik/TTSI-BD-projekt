/*jshint esversion:8*/
/*jshint node:true*/
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     queryInterface.createTable("admins", {
      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: {
              args: [6, 30],
              msg: "Hasło może mieć minimalnie 6 a maksymalnie 30 znaków"
            } 
        }
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
     });
  },

  down: async (queryInterface, Sequelize) => {
     queryInterface.dropTable("admins");
  }
};
