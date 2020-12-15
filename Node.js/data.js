/*jshint esversion:8*/
/*jshint node:true*/

const Article = require("./models/Article");

const errorHandler = (err) => {
    console.error("Error: ", err);
};

module.exports.articles = async() => {
    const data = await Article.findAll().catch(errorHandler);
    return data;
}; 