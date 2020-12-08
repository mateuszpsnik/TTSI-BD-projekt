/*jshint esversion: 6*/

const express = require("express");
const app = express();
const path = require("path");
const mysql = require("mysql");

const connection = mysql.createConnection({ 
    host: "localhost",
    user: "root",
    password: "",
    database: "ttsi"
});

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected.");
    const sql = "SELECT num, str FROM testtable";
    connection.query(sql, (err, result, fields) => {
        if (err) throw err;
        console.log(result[0].num);
        console.log(result[0].str);
    });
});

app.set("view engine", "ejs");

app.listen("3000");
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => { 
    res.render("index");
});