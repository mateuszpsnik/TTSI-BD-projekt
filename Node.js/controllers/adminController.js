/*jshint esversion: 8*/

const Admin = require("../models/Admin");
const Article = require("../models/Article");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Album = require("../models/Album");
const Movie = require("../models/Movie");
const AlbumReview = require("../models/AlbumReview");

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
    await User.findAll()
    .then((result) => {
        res.render("admin/usersIndex", { title: "Użytkownicy", users: result });
    })
    .catch(err => {
        console.log(err);
    });
};

module.exports.albums_index = async (req, res) => {
    await Album.findAll()
    .then((result) => {
        res.render("admin/albumsIndex", { title: "Albumy", albums: result });
    })
    .catch(err => console.log(err));
};

module.exports.album_edit = async (req, res) => {
    const id = req.params.id;
    await Album.findAll({ where: { id: id } })
    .then(result => {
        res.render("admin/albumEdit", { title: "Edytuj album", album: result[0] });
    })
    .catch(err => console.log(err));
};

module.exports.movies_index = async (req, res) => {
    await Movie.findAll()
    .then((result) => {
        res.render("admin/moviesIndex", { title: "Filmy", movies: result });
    })
    .catch(err => console.log(err));
};

module.exports.movie_edit = async (req, res) => {
    const id = req.params.id;
    await Movie.findAll({ where: { id: id } })
    .then(result => {
        res.render("admin/movieEdit", { title: "Edytuj film", movie: result[0] });
    })
    .catch(err => console.log(err));
};

module.exports.articles_index = async (req, res) => {
    await Article.findAll()
    .then((result) => {
        res.render("admin/articlesIndex", { title: "Wszystkie artykuły", articles: result });
    })
    .catch((err) => {
        console.log(err);
    });
};

module.exports.articles_edit = async (req, res) => {
    const id = req.params.id;
    await Article.findAll({ where: { id: id } })
    .then(result => {
        res.render("admin/articlesEdit", { title: result[0].title, article: result[0] });
    })
    .catch(err => {
        console.log(err);
    });
};

module.exports.reviews_index = async(req, res) => {
    await AlbumReview.findAll()
    .then(result => {
        res.render("admin/reviewsIndex", { title: "Recenzje", albumReviews: result });
    })
    .catch(err => console.log(err));
};

module.exports.accept_album_review = async(req, res) => {
    // SELECT `AlbumReview`.`id`, `AlbumReview`.`albumId`, `AlbumReview`.`introduction`, `AlbumReview`.`content`, 
    // `AlbumReview`.`points`, `AlbumReview`.`editorId`, `AlbumReview`.`userId`, `AlbumReview`.`accepted`, `AlbumReview`.`createdAt`,
    // `AlbumReview`.`updatedAt`, `Album`.`id` AS `Album.id`, `Album`.`title` AS `Album.title`, `Album`.`artist` AS `Album.artist`,
    // `Album`.`genre` AS `Album.genre`, `Album`.`year` AS `Album.year`, `Album`.`cover` AS `Album.cover`, `Album`.`accepted` AS `Album.accepted`, 
    // `Album`.`createdAt` AS `Album.createdAt`, `Album`.`updatedAt` AS `Album.updatedAt` FROM `AlbumReviews` AS `AlbumReview` LEFT OUTER JOIN `Albums`
    // AS `Album` ON `AlbumReview`.`albumId` = `Album`.`id` WHERE `AlbumReview`.`id` = '3';
    const id = req.params.id;
    await AlbumReview.findAll({
        where: { id: id },
        include: [{ model: Album }]
    })
    .then(reviews => {
        res.render("admin/acceptAlbumReview", { title: "Zaakceptuj recenzję",
        review: reviews[0], album: reviews[0].Album });
    })
    .catch(err => console.log(err));
};

module.exports.signup_post = async (req, res) => {
    const { password } = req.body;

    try {
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