/*jshint esversion:8*/

const Sequelize = require("sequelize");
require("../connection");
const { len, isEmail, notEmpty } = require("validator");
const bcrypt = require("bcrypt");

const User = sequelize.define("User", {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {
                msg: "Wpisz nazwę użytkownika"
            }
        }
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: "Podaj adres e-mail we właściwej formie"
            }
        }
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
    image: Sequelize.BLOB
}, {
    hooks: {
        afterValidate: async (user, options) => {
            const salt = await bcrypt.genSalt();
            user.password = await bcrypt.hash(user.password, salt);
        }
    }
}
);

// static method to login user
User.login = async (email, password) => {
    const user = await User.findAll({ 
        where: {
            email: email
        }
    });

    if (user[0]) {
        const auth = await bcrypt.compare(password, user[0].password);

        if (auth) {
            return user[0];
        }

        throw Error("incorrect password");
    }

    throw Error("incorrect email");
};

module.exports = User;