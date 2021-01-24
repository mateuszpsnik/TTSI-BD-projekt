/*jshint esversion: 8*/

const { render } = require("ejs");
const express = require("express");

const app = express();
const path = require("path");
const articlesRoutes = require("./routes/articlesRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const editorRoutes = require("./routes/editorRoutes");
const musicRoutes = require("./routes/musicRoutes");
const moviesRoutes = require("./routes/moviesRoutes");
const Article = require("./models/Article");
const cookieParser = require("cookie-parser");
const { checkUser, checkAdmin, checkEditor } = require("./middleware/authMiddleware");


const Editor = require("./models/Editor");

// connection with the database
require("./connection");

app.set("view engine", "ejs");

// middleware & static files
app.listen("3000");
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

app.get("*", checkUser); // "*" means "apply to every get request"
app.get("*", checkEditor);
app.get("*", checkAdmin);
app.get("/", async (req, res) => { 
    Article.findAll({
        limit: 3
    })
    .then((result) => {
        res.render("index", { title: "Muzyka i film - Strona główna", articles: result });
    })
    .catch((err) => {
        console.log(err);
    });
});

// routes
app.use(authRoutes);
app.use("/articles", articlesRoutes);
app.use("/users", userRoutes);
app.use("/admin", adminRoutes);
app.use("/editor", editorRoutes);
app.use("/music", musicRoutes);
app.use("/movies", moviesRoutes);

// 404
app.use((req, res) => {
    res.render("404", { title: "Strona nie istnieje" });
});