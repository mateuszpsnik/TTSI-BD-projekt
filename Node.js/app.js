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
const cookieParser = require("cookie-parser");
const { checkUser, checkAdmin, checkEditor } = require("./middleware/authMiddleware");

const Editor = require("./models/Editor");
const Article = require("./models/Article");
const Album = require("./models/Album");
const Movie = require("./models/Movie");
const AlbumReview = require("./models/AlbumReview");
const MovieReview = require("./models/MovieReview");

// connection with the database
const { Sequelize, sequelize } = require("./connection");

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
    try {
        // SELECT `id`, `image`, `title`, `introduction` FROM `Articles` AS `Article` ORDER BY `Article`.`id` DESC LIMIT 3;
        const articles = await Article.findAll({
            attributes: [ "id", "image", "title", "introduction" ],
            order: [ 
                [ "id", "DESC" ]
            ],
            limit: 3
        });
        // SELECT `AlbumReview`.`id`, `AlbumReview`.`albumId`, `AlbumReview`.`introduction`, `AlbumReview`.`points`, `AlbumReview`.`accepted`, 
        // `Album`.`id` AS `Album.id`, `Album`.`title` AS `Album.title`, `Album`.`cover` AS `Album.cover` FROM `AlbumReviews` AS `AlbumReview` 
        // LEFT OUTER JOIN `Albums` AS `Album` ON `AlbumReview`.`albumId` = `Album`.`id` WHERE `AlbumReview`.`accepted` = true 
        // ORDER BY `AlbumReview`.`id` DESC LIMIT 1;
        const lastAlbumReview = await AlbumReview.findAll({
            attributes: [ "id", "albumId", "introduction", "content", "points", "accepted" ],
            include: [{
                model: Album,
                attributes: [ "id", "title", "cover" ]
            }],
            where: { accepted: true },
            order: [ 
                [ "id", "DESC" ]
            ],
            limit: 1 
        });
        // SELECT `MovieReview`.`id`, `MovieReview`.`movieId`, `MovieReview`.`introduction`, `MovieReview`.`points`, `MovieReview`.`accepted`, 
        // `Movie`.`id` AS `Movie.id`, `Movie`.`title` AS `Movie.title`, `Movie`.`poster` AS `Movie.poster` FROM `MovieReviews` AS `MovieReview` 
        // LEFT OUTER JOIN `Movies` AS `Movie` ON `MovieReview`.`movieId` = `Movie`.`id` WHERE `MovieReview`.`accepted` = true 
        // ORDER BY `MovieReview`.`id` DESC LIMIT 1;
        const lastMovieReview = await MovieReview.findAll({
            attributes: [ "id", "movieId", "introduction", "content", "points", "accepted" ],
            include: [{
                model: Movie,
                attributes: [ "id", "title", "poster" ]
            }],
            where: { accepted: true },
            order: [ 
                [ "id", "DESC" ]
            ],
            limit: 1 
        });
        // SELECT `id`, `title`, `artist`, `cover` FROM `Albums` AS `Album` WHERE `Album`.`accepted` = true ORDER BY `Album`.`id` DESC LIMIT 1;
        const lastAlbum = await Album.findAll({
            attributes: [ "id", "title", "artist", "cover" ],
            where: { accepted: true },
            order: [
                [ "id", "DESC" ]
            ],
            limit: 1
        });
        // SELECT `id`, `title`, `director`, `poster` FROM `Movies` AS `Movie` WHERE `Movie`.`accepted` = true ORDER BY `Movie`.`id` DESC LIMIT 1;
        const lastMovie = await Movie.findAll({
            attributes: [ "id", "title", "director", "poster" ],
            where: { accepted: true },
            order: [
                [ "id", "DESC" ]
            ],
            limit: 1
        });
        // SELECT `id`, `title`, `artist`, `cover` FROM `Albums` AS `Album` WHERE `Album`.`accepted` = true ORDER BY RAND() LIMIT 1;
        const randomAlbum = await Album.findAll({
            attributes: [ "id", "title", "artist", "cover" ],
            where: { accepted: true },
            order: Sequelize.literal("RAND()"),
            limit: 1
        });
        // SELECT `id`, `title`, `director`, `poster` FROM `Movies` AS `Movie` WHERE `Movie`.`accepted` = true ORDER BY RAND() LIMIT 1;
        const randomMovie = await Movie.findAll({
            attributes: [ "id", "title", "director", "poster" ],
            where: { accepted: true },
            order: Sequelize.literal("RAND()"),
            limit: 1
        });

        res.render("index", { title: "Muzyka i film - Strona główna", articles: articles,
            lastAlbumReview: lastAlbumReview[0], lastMovieReview: lastMovieReview[0],
            lastAlbum: lastAlbum[0], lastMovie: lastMovie[0], randomAlbum: randomAlbum[0],
            randomMovie: randomMovie[0] });
    }
    catch (err) {
        console.log(err);
    }    
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