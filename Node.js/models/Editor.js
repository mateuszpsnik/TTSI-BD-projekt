/*jshint esversion:8*/

const Sequelize = require("sequelize");
require("../connection");
const { len, isEmail, notEmpty } = require("validator");
const bcrypt = require("bcrypt");
const sequelize = require("../connection");
const Article = require("./Article");

const Editor = sequelize.define("Editor", {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
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
    image: Sequelize.STRING
}, {
    hooks: {
        afterValidate: async (editor, options) => {
            const salt = await bcrypt.genSalt();
            editor.password = await bcrypt.hash(editor.password, salt);
        }
    }
});

Editor.login = async (email, password) => {
    // SELECT `email`, `password` FROM `Editors` AS `Editor` WHERE `Editor`.`email` = 'mateuszpsnik@gmail.com';
    const editorsEmail = await Editor.findAll({
        attributes: [ "id", "email", "password" ],
        where: {
            email: email
        }
    });

    const editor = editorsEmail[0];

    if (editor) {
        const auth = await bcrypt.compare(password, editor.password);
        if (auth)
            return editor;
        
        throw Error("incorrect password");
    }
    throw Error("incorrect email");
};

module.exports = Editor;