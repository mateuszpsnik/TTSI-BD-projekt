/*jshint esversion: 8*/

const Admin = require("../models/Admin");
const Article = require("../models/Article");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Album = require("../models/Album");
const Movie = require("../models/Movie");
const AlbumReview = require("../models/AlbumReview");
const MovieReview = require("../models/MovieReview");
const sequelize = require("../connection");

const handleErrors = (err) => {
    if (err.message === "incorrect password") {
        return "Nieprawidłowe hasło";
    }

    if (err.message.includes("Validation error")) {
        return err.errors[0].message;
    }
};

const maxExpirationTime = 60 * 60; // an hour

const createToken = (id) => {
    return jwt.sign({ id }, "some admin secret", { 
        expiresIn: maxExpirationTime
    });
};

module.exports.admin_index = (req, res) => {
    res.render("admin/index", { title: "Panel administracyjny" });
};

module.exports.admin_users = async (req, res) => {
    // SELECT `id`, `image`, `username` FROM `Users` AS `User` LIMIT 20;
    await User.findAll({
        attributes: [ "id", "image", "username" ],
        limit: 20
    })
    .then((result) => {
        res.render("admin/usersIndex", { title: "Użytkownicy", users: result });
    })
    .catch(err => {
        console.log(err);
    });
};

module.exports.albums_index = async (req, res) => {
    // SELECT `id`, `title`, `cover`, `artist`, `accepted` FROM `Albums` AS `Album` LIMIT 20;
    await Album.findAll({
        attributes: [ "id", "title", "cover", "artist", "accepted" ],
        limit: 20
    })
    .then((result) => {
        res.render("admin/albumsIndex", { title: "Albumy", albums: result });
    })
    .catch(err => console.log(err));
};

module.exports.album_edit = async (req, res) => {
    const id = req.params.id;
    // SELECT `id`, `title`, `artist`, `genre`, `year` FROM `Albums` AS `Album` WHERE `Album`.`id` = '1';
    await Album.findAll({
        attributes: [ "id", "title", "artist", "genre", "year" ], 
        where: { id: id } })
    .then(result => {
        res.render("admin/albumEdit", { title: "Edytuj album", album: result[0] });
    })
    .catch(err => console.log(err));
};

module.exports.movies_index = async (req, res) => {
    // SELECT `id`, `title`, `director`, `poster`, `accepted` FROM `Movies` AS `Movie` LIMIT 20;
    await Movie.findAll({
        attributes: [ "id", "title", "director", "poster", "accepted" ],
        limit: 20
    })
    .then((result) => {
        res.render("admin/moviesIndex", { title: "Filmy", movies: result });
    })
    .catch(err => console.log(err));
};

module.exports.movie_edit = async (req, res) => {
    const id = req.params.id;
    // SELECT `id`, `title`, `director`, `genre`, `year` FROM `Movies` AS `Movie` WHERE `Movie`.`id` = '1';
    await Movie.findAll({
        attributes: [ "id", "title", "director", "genre", "year" ],
        where: { id: id } 
    })
    .then(result => {
        res.render("admin/movieEdit", { title: "Edytuj film", movie: result[0] });
    })
    .catch(err => console.log(err));
};

module.exports.articles_index = async (req, res) => {
    // SELECT `id`, `image`, `title`, `introduction` FROM `Articles` AS `Article` LIMIT 20;
    await Article.findAll({
        attributes: [ "id", "image", "title", "introduction" ],
        limit: 20
    })
    .then((result) => {
        res.render("admin/articlesIndex", { title: "Wszystkie artykuły", articles: result });
    })
    .catch((err) => {
        console.log(err);
    });
};

module.exports.articles_edit = async (req, res) => {
    const id = req.params.id;
    // SELECT `id`, `title`, `introduction`, `content`, `category` FROM `Articles` AS `Article` WHERE `Article`.`id` = '1';
    await Article.findAll({ 
        attributes: [ "id", "title", "introduction", "content", "category" ],
        where: { id: id } 
    })
    .then(result => {
        res.render("admin/articlesEdit", { title: result[0].title, article: result[0] });
    })
    .catch(err => {
        console.log(err);
    });
};

module.exports.reviews_index = async(req, res) => {
    try {
        let albumReviews = false;
        let movieReviews = false;
        // SELECT `AlbumReview`.`id`, `AlbumReview`.`introduction`, `AlbumReview`.`accepted`, `Album`.`id` AS `Album.id`, 
        // `Album`.`title` AS `Album.title` FROM `AlbumReviews` AS `AlbumReview` LEFT OUTER JOIN `Albums` AS `Album` 
        // ON `AlbumReview`.`albumId` = `Album`.`id`;
        albumReviews = await AlbumReview.findAll({
            attributes: [ "id", "introduction", "accepted" ],
            include: [{
                model: Album,
                attributes: [ "id", "title" ]
            }]
        });
        // SELECT `MovieReview`.`id`, `MovieReview`.`introduction`, `MovieReview`.`accepted`, `Movie`.`id` AS `Movie.id`,
        //  `Movie`.`title` AS `Movie.title` FROM `MovieReviews` AS `MovieReview` LEFT OUTER JOIN `Movies` AS `Movie` 
        // ON `MovieReview`.`movieId` = `Movie`.`id`;
        movieReviews = await MovieReview.findAll({
            attributes: [ "id", "introduction", "accepted" ],
            include: [{
                model: Movie,
                attributes: [ "id", "title" ]
            }]
        });

        res.render("admin/reviewsIndex", { title: "Recenzje", 
            albumReviews: albumReviews, movieReviews: movieReviews });
    }
    catch (err) {
        console.log(err);
    }
};

module.exports.accept_album_review = async (req, res) => {
    const id = req.params.id;
    // SELECT `AlbumReview`.`id`, `AlbumReview`.`introduction`, `AlbumReview`.`content`, `AlbumReview`.`points`, 
    // `Album`.`id` AS `Album.id`, `Album`.`title` AS `Album.title`, `Album`.`cover` AS `Album.cover` FROM `AlbumReviews` 
    // AS `AlbumReview` LEFT OUTER JOIN `Albums` AS `Album` ON `AlbumReview`.`albumId` = `Album`.`id` WHERE `AlbumReview`.`id` = '1';
    await AlbumReview.findAll({
        where: { id: id },
        attributes: [ "id", "introduction", "content", "points" ],
        include: [{ 
            model: Album,
            attributes: [ "id", "title", "cover" ]
        }]
    })
    .then(reviews => {
        res.render("admin/acceptAlbumReview", { title: "Zaakceptuj recenzję",
        review: reviews[0], album: reviews[0].Album });
    })
    .catch(err => console.log(err));
};

module.exports.accept_movie_review = async (req, res) => {
    const id = req.params.id;
    // SELECT `MovieReview`.`id`, `MovieReview`.`introduction`, `MovieReview`.`content`, `MovieReview`.`points`, `Movie`.`id` 
    // AS `Movie.id`, `Movie`.`title` AS `Movie.title`, `Movie`.`poster` AS `Movie.poster` FROM `MovieReviews` AS `MovieReview` 
    // LEFT OUTER JOIN `Movies` AS `Movie` ON `MovieReview`.`movieId` = `Movie`.`id` WHERE `MovieReview`.`id` = '1';
    await MovieReview.findAll({
        where: { id: id },
        attributes: [ "id", "introduction", "content", "points" ],
        include: [{ 
            model: Movie,
            attributes: [ "id", "title", "poster" ]
        }]
    })
    .then(reviews => {
        res.render("admin/AcceptMovieReview", { title: "Zaakceptuj recenzję",
        review: reviews[0], movie: reviews[0].Movie });
    })
    .catch(err => console.log(err));
};

module.exports.signup_post = async (req, res) => {
    const { password } = req.body;

    try {
        // INSERT INTO `Admins` (`id`,`password`,`createdAt`,`updatedAt`) VALUES (DEFAULT,?,?,?);
        const admin = await Admin.create({ password });
        const token = createToken(admin.id);
        res.cookie("jwtAdmin", token, { httpOnly: true, maxAge: maxExpirationTime * 1000 });
        res.status(201).json(admin.id);
    }
    catch (err) {
        const error = handleErrors(err);
        res.status(400).json({ error, err });
    }
};

module.exports.signup_get = (req, res) => {
    res.render("admin/signup", { title: "Zarejestruj admina" });
};

module.exports.login_get = (req, res) => {
    res.render("admin/login", { title: "Zaloguj się"});
};

module.exports.login_post = async (req, res) => {
    const { password } = req.body;
    
    try {
        const admin = await Admin.login(password);
        const token = createToken(admin.id);
        res.cookie("jwtAdmin", token, { httpOnly: true, maxAge: maxExpirationTime * 1000 });
        res.status(200).json({ admin: admin.id });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};

module.exports.logout_get = (req, res) => {
    res.cookie("jwtAdmin", "", { maxAge: 1 });
    res.redirect("/");
};