/*jshint esversion:8*/

const Sequelize = require("sequelize");
require("../connection");
const { len, isEmail, notEmpty } = require("validator");
const bcrypt = require("bcrypt");
const sequelize = require("../connection");

const Admin = sequelize.define("Admin", {
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
    }
}, {
    hooks: {
        afterValidate: async (admin, options) => {
            const salt = await bcrypt.genSalt();
            admin.password = await bcrypt.hash(admin.password, salt);
        }
    }
});

// static method to login admin
Admin.login = async (password) => {
    const admins = await Admin.findAll();
    let adminToReturn;

    for (let i = 0; i < admins.length; i++) {
        const auth = await bcrypt.compare(password, admins[i].password);

        if (auth) {
            return admins[i];
        }
    }

    throw Error("incorrect password");
};

module.exports = Admin;