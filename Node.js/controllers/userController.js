/*jshint esversion: 8*/

const User = require("../models/User");
const fs = require("fs");
const { handleErrors } = require("./authController");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Album = require("../models/Album");
const Movie = require("../models/Movie");
const AlbumRating = require("../models/AlbumRating");
const MovieRating = require("../models/MovieRating");
const FavouriteAlbum = require("../models/FavouriteAlbum");
const FavouriteMovie = require("../models/FavouriteMovie");
const AlbumReview = require("../models/AlbumReview");
const MovieReview = require("../models/MovieReview");

const getUserId = (req) => {
    const token = req.cookies.jwt;
    let userId;

        if (token) {
            jwt.verify(token, "some example secret", async (err, decodedToken) => {
                if (err) {
                    console.log(err.message);
                }
                else {
                    console.log("token", decodedToken);
                    userId = decodedToken.id;
                    console.log("userId", userId);
                }
            });
        }

    return userId;
};

const user_details = (req, res) => {
    const id = req.params.id;
    // SELECT `id`, `username`, `email`, `password`, `image` FROM `Users` AS `User` WHERE `User`.`id` = '1';
    User.findAll({
        attributes: {
            exclude: [ "createdAt", "updatedAt", "userId" ]
        },
        where: { id: id } 
    })
    .then(result => {
        res.render("user/details", { title: result[0].title, user: result[0] });
    })
    .catch(err => {
        console.log(err);
    });
};

const user_fav_albums = async (req, res) => {
    const id = req.params.id;

    try {
        // SELECT `FavouriteAlbum`.`id`, `FavouriteAlbum`.`userId`, `Album`.`id` AS `Album.id`, `Album`.`title` AS `Album.title`, `Album`.`artist` 
        // AS `Album.artist`, `Album`.`cover` AS `Album.cover` FROM `FavouriteAlbums` AS `FavouriteAlbum` LEFT OUTER JOIN `Albums` AS `Album` 
        // ON `FavouriteAlbum`.`albumId` = `Album`.`id` WHERE `FavouriteAlbum`.`userId` = '2';
        const favourites = await FavouriteAlbum.findAll({
            attributes: [ "id", "userId" ],
            where: { userId: id },
            include: [{
                model: Album,
                attributes: [ "id", "title", "artist", "cover" ]
            }]
        });

        res.render("user/favouriteAlbums", { title: "Ulubione albumy", favourites: favourites });
    }
    catch (err) {
        console.log(err);
    }
};

const user_fav_movies = async (req, res) => {
    const id = req.params.id;

    try {
        // SELECT `FavouriteMovie`.`id`, `FavouriteMovie`.`userId`, `Movie`.`id` AS `Movie.id`, `Movie`.`title` AS `Movie.title`, `Movie`.`director` 
        // AS `Movie.director`, `Movie`.`poster` AS `Movie.poster` FROM `FavouriteMovies` AS `FavouriteMovie` LEFT OUTER JOIN `Movies` AS `Movie` 
        // ON `FavouriteMovie`.`movieId` = `Movie`.`id` WHERE `FavouriteMovie`.`userId` = '2';
        const favourites = await FavouriteMovie.findAll({
            attributes: [ "id", "userId" ],
            where: { userId: id },
            include: [{
                model: Movie,
                attributes: [ "id", "title", "director", "poster" ]
            }]
        });

        res.render("user/favouriteMovies", { title: "Ulubione filmy", favourites: favourites });
    }
    catch (err) {
        console.log(err);
    }
};

const user_album_ratings = async (req, res) => {
    const id = req.params.id;

    try {
        // SELECT `AlbumRating`.`id`, `AlbumRating`.`points`, `AlbumRating`.`userId`, `Album`.`id` AS `Album.id`, `Album`.`title` 
        // AS `Album.title`, `Album`.`artist` AS `Album.artist`, `Album`.`cover` AS `Album.cover` FROM `AlbumRatings` AS `AlbumRating` 
        // LEFT OUTER JOIN `Albums` AS `Album` ON `AlbumRating`.`albumId` = `Album`.`id` WHERE `AlbumRating`.`userId` = '2';
        const ratings = await AlbumRating.findAll({
            attributes: [ "id", "points", "userId" ],
            where: { userId: id },
            include: [{
                model: Album,
                attributes: [ "id", "title", "artist", "cover" ]
            }]
        });

        res.render("user/albumRatings", { title: "Oceny albumów", ratings: ratings });
    }
    catch (err) {
        console.log(err);
    }
};

const user_movie_ratings = async (req, res) => {
    const id = req.params.id;

    try {
        // SELECT `MovieRating`.`id`, `MovieRating`.`points`, `MovieRating`.`userId`, `Movie`.`id` AS `Movie.id`, `Movie`.`title` 
        // AS `Movie.title`, `Movie`.`director` AS `Movie.director`, `Movie`.`poster` AS `Movie.poster` FROM `MovieRatings` AS `MovieRating` 
        // LEFT OUTER JOIN `Movies` AS `Movie` ON `MovieRating`.`movieId` = `Movie`.`id` WHERE `MovieRating`.`userId` = '2';
        const ratings = await MovieRating.findAll({
            attributes: [ "id", "points", "userId" ],
            where: { userId: id },
            include: [{
                model: Movie,
                attributes: [ "id", "title", "director", "poster" ]
            }]
        });

        res.render("user/movieRatings", { title: "Oceny filmów", ratings: ratings });
    }
    catch (err) {
        console.log(err);
    }
};

const user_album_reviews = async (req, res) => {
    const id = req.params.id;

    try {
        // SELECT `AlbumReview`.`id`, `AlbumReview`.`points`, `AlbumReview`.`userId`, `AlbumReview`.`accepted`, `Album`.`id` 
        // AS `Album.id`, `Album`.`title` AS `Album.title`, `Album`.`artist` AS `Album.artist`, `Album`.`cover` AS `Album.cover` 
        // FROM `AlbumReviews` AS `AlbumReview` LEFT OUTER JOIN `Albums` AS `Album` ON `AlbumReview`.`albumId` = `Album`.`id` 
        // WHERE `AlbumReview`.`userId` = '2';
        const reviews = await AlbumReview.findAll({
            attributes: [ "id", "points", "userId", "accepted" ],
            where: { userId: id },
            include: [{
                model: Album,
                attributes: [ "id", "title", "artist", "cover" ]
            }]
        });

        res.render("user/albumReviews", { title: "Recenzje albumów", reviews: reviews });
    }
    catch (err) {
        console.log(err);
    }
};

const user_movie_reviews = async (req, res) => {
    const id = req.params.id;

    try {
        // SELECT `MovieReview`.`id`, `MovieReview`.`points`, `MovieReview`.`userId`, `MovieReview`.`accepted`, `Movie`.`id` 
        // AS `Movie.id`, `Movie`.`title` AS `Movie.title`, `Movie`.`director` AS `Movie.director`, `Movie`.`poster` AS `Movie.poster` 
        // FROM `MovieReviews` AS `MovieReview` LEFT OUTER JOIN `Movies` AS `Movie` ON `MovieReview`.`movieId` = `Movie`.`id` 
        // WHERE `MovieReview`.`userId` = '2';
        const reviews = await MovieReview.findAll({
            attributes: [ "id", "points", "userId", "accepted" ],
            where: { userId: id },
            include: [{
                model: Movie,
                attributes: [ "id", "title", "director", "poster" ]
            }]
        });

        res.render("user/movieReviews", { title: "Recenzje filmów", reviews: reviews });
    }
    catch (err) {
        console.log(err);
    }
};

const user_edit = (req, res) => {
    res.render("user/edit", { title: "Edytuj profil" });
};

const user_update = async (req, res) => {
    const { id, username, email, checkboxPassword,
         newPassword } = req.body;

    //  SELECT `id`, `image` FROM `Users` AS `User` WHERE `User`.`id` = '1';
    const users = await User.findAll({
        attributes: [ "id", "image" ],
        where: { id: id } });
    const userToBeUpdated = users[0];

    let imagePath;
    if (req.file) {
        imagePath = "/images/users/" + req.file.filename;
        console.log(imagePath);
        fs.unlinkSync("public" + userToBeUpdated.image, (err) => {
            if (err) {
                throw Error(err);
            }
        });
    }

    try {
        if (req.file) {
            // UPDATE `Users` SET `username`=?,`email`=?,`password`=?,`image`=?,`updatedAt`=? WHERE `id` = ?
            await User.update({
                username: username,
                email: email,
                password: newPassword,
                image: imagePath
            }, {
                where: { id: id }
            });
        }
        else {
            // UPDATE `Users` SET `username`=?,`email`=?,`password`=?,`updatedAt`=? WHERE `id` = ?
            await User.update({
                username: username,
                email: email,
                password: newPassword
            }, {
                where: { id: id }
            });
        }

        res.status(200).json({ success: true });
    }
    catch (err) {
        console.log(err);
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};

const user_get_delete = async (req, res) => {
    res.render("user/delete", { title: "Usuń konto" });
};

const user_delete = async (req, res) => {
    const { id } = req.params;
    const { admin, password } = req.body;
    // SELECT `id`, `password` FROM `Users` AS `User` WHERE `User`.`id` = '2';
    const users = await User.findAll({
        attributes: [ "id", "password" ], 
        where: { id: id } 
    });

    try {
        if (!admin) {
            const auth = await bcrypt.compare(password, users[0].password);

            if (!auth) {
                throw Error("incorrect password");
            }
        }
        // DELETE FROM `Users` WHERE `id` = '2'
        await User.destroy({
            where: { id: id }
        });

        if (admin) {
            res.status(200).json({ redirect: "/admin/users" });
        }
        else {
            res.status(200).json({ redirect: "/" });
        }  
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ err });
    }

};

module.exports = {
    getUserId,
    user_details,
    user_fav_albums,
    user_fav_movies,
    user_album_ratings,
    user_movie_ratings,
    user_album_reviews,
    user_movie_reviews,
    user_edit,
    user_update,
    user_get_delete,
    user_delete
};