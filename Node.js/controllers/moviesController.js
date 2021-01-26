/*jshint esversion: 8*/

const Movie = require("../models/Movie");
const fs = require("fs");
const { getUserId } = require("./userController");
const { getEditorId } = require("./editorController");
const MovieRating = require("../models/MovieRating");
const MovieReview = require("../models/MovieReview");
const FavouriteMovie = require("../models/FavouriteMovie");

const add_movie_get = (req, res) => {
    res.render("movies/add", { title: "Dodaj Movies" });
};

const add_movie_post = async (req, res) => {
    const { title, director, genre, year } = req.body;
    const posterPath = "/images/movies/" + req.file.filename;
    console.log(posterPath);

    try {
        // INSERT INTO `Movies` (`id`,`title`,`director`,`genre`,`year`,`poster`,`accepted`,`createdAt`,`updatedAt`) 
        // VALUES (DEFAULT,?,?,?,?,?,?,?,?);
        const movie = await Movie.create({
            title: title,
            director: director,
            genre: genre,
            year: year,
            poster: posterPath,
            accepted: false
        });

        res.status(201).json({ movie: movie.id });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ err });
    }
};

const movie_details = async (req, res) => {
    const id = req.params.id;
    console.log(id);

    try {
        // SELECT `Movie`.`id`, `Movie`.`title`, `Movie`.`director`, `Movie`.`genre`, `Movie`.`year`, `Movie`.`poster`, `Movie`.`accepted`, 
        // `MovieReviews`.`id` AS `MovieReviews.id`, `MovieReviews`.`movieId` AS `MovieReviews.movieId`, `MovieReviews`.`introduction` AS 
        // `MovieReviews.introduction`, `MovieReviews`.`content` AS `MovieReviews.content`, `MovieReviews`.`points` AS `MovieReviews.points`, 
        // `MovieReviews`.`editorId` AS `MovieReviews.editorId`, `MovieReviews`.`userId` AS `MovieReviews.userId`, `MovieReviews`.`accepted` 
        // AS `MovieReviews.accepted` FROM `Movies` AS `Movie` LEFT OUTER JOIN `MovieReviews` AS `MovieReviews` ON 
        // `Movie`.`id` = `MovieReviews`.`movieId` AND `MovieReviews`.`movieId` = '1' WHERE `Movie`.`id` = '1' AND `Movie`.`accepted` = true;
        const movies = await Movie.findAll({ 
            attributes: {
                exclude: [ "createdAt", "updatedAt" ]
            },
            where: { 
                id: id,
                accepted: true
            },
            include: [{
                model: MovieReview,
                where: { movieId: id },
                attributes: {
                    exclude: [ "createdAt", "updatedAt" ]
                },
                required: false
            }] 
        });

        const userId = getUserId(req);
        let ratings = [ false ];
        let reviews = [ false ];

        if (movies[0]) {
            reviews = movies[0].MovieReviews;
        }

        if (userId) {
            // SELECT `id`, `points` FROM `MovieRatings` AS `MovieRating` WHERE `MovieRating`.`movieId` = '1' AND `MovieRating`.`userId` = 1;
            ratings = await MovieRating.findAll({ 
                attributes: [ "id", "points" ],
                where: {
                    movieId: id,
                    userId: userId 
                }
            });
        }

        if (movies[0]) {
            res.render("movies/details", { title: movies[0].title, movie: movies[0],
                rating: ratings[0], review: reviews[0] });
        }
        else {
            res.render("404", { title: "Strona nie istnieje" });
        }
    }
    catch (err) {
        console.log(err);
    }
};

const movie_accept = async (req, res) => {
    const id = req.params.id;
    console.log(id);

    // UPDATE `Movies` SET `accepted`=?,`updatedAt`=? WHERE `id` = ?
    await Movie.update({
        accepted: true
    },{
        where: { id: id }
    })
    .then(result => {
        res.status(201).json({ redirect: "/admin/movies" });
    })
    .catch(err => console.log(err));
};

const movie_update = async (req, res) => {
    const { id, title, director, genre, year } = req.body;
    // SELECT `id`, `poster` FROM `Movies` AS `Movie` WHERE `Movie`.`id` = '1';
    const movies = await Movie.findAll({
        attributes: [ "id", "poster" ],
        where: { id: id }
    });
    const movieToBeUpdated = movies[0];

    console.log(req.file);

    let posterPath; 
    if (req.file) {
        posterPath = "/images/movies/" + req.file.filename;
        console.log(posterPath);
        fs.unlinkSync("public" + movieToBeUpdated.poster, (err) => {
            if (err) {
                throw Error(err);
            }
        });
    }

    try {
        let movie;
        if (req.file) {
            posterPath = "/images/movies/" + req.file.filename;
            // UPDATE `Movies` SET `title`=?,`director`=?,`genre`=?,`year`=?,`poster`=?,`updatedAt`=? WHERE `id` = ?
            movie = await Movie.update({
                title: title,
                director: director,
                genre: genre,
                year: year,
                poster: posterPath
            },{
                where: { id: id }
            });
        } else {
            // UPDATE `Movies` SET `title`=?,`director`=?,`genre`=?,`year`=?,`updatedAt`=? WHERE `id` = ?
            movie = await Movie.update({
                title: title,
                director: director,
                genre: genre,
                year: year
            },{
                where: { id: id }
            });
        }

        res.status(201).json({ movie: movie.id });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ error: err });
    }
};

const movie_delete = async (req, res) => {
    const id = req.params.id;
    console.log(id);
    // DELETE FROM `Movies` WHERE `id` = '1'
    await Movie.destroy({
        where: { id: id }
    })
    .then(result => res.json({ redirect: "/admin/movies" }))
    .catch(err => console.log(err));
};

const add_rating = async (req, res) => {
    const { rating, movieId } = req.body;
    const userId = getUserId(req);
    
    try {
        // INSERT INTO `MovieRatings` (`id`,`points`,`movieId`,`userId`,`createdAt`,`updatedAt`) VALUES (DEFAULT,?,?,?,?,?);
        const movieRating = await MovieRating.create({
            points: rating,
            movieId: movieId,
            userId: userId
        });

        res.status(201).json({ rating: movieRating });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ error: err });
    }
};

const add_to_favourites = async (req, res) => {
    const movieId = req.params.id;
    const userId = getUserId(req);
    // INSERT INTO `FavouriteMovies` (`id`,`movieId`,`userId`,`createdAt`,`updatedAt`) VALUES (DEFAULT,?,?,?,?);
    await FavouriteMovie.create({
        movieId: movieId,
        userId: userId
    });
};

const add_review_get = (req, res) => {
    const movieId = req.params.id;

    res.render("movies/addReview.ejs", { title: "Dodaj recenzję", movieId: movieId });
};

const add_review_post = async (req, res) => {
    const { introduction, content, rating, movieId } = req.body;
    const userId = getUserId(req);
    const editorId = getEditorId(req);

    try {
        let movieReview;
        if (editorId) {
            console.log("editor");
            // INSERT INTO `MovieReviews` (`id`,`movieId`,`introduction`,`content`,`points`,`editorId`,`userId`,`accepted`,`createdAt`,`updatedAt`)
            //  VALUES (DEFAULT,?,?,?,?,?,?,?,?,?);
            movieReview = await MovieReview.create({
                movieId: movieId,
                introduction: introduction,
                content: content,
                points: rating,
                editorId: editorId,
                userId: 0,
                accepted: true
            });
        }
        else if (userId) {
            console.log("user");
            // INSERT INTO `MovieReviews` (`id`,`movieId`,`introduction`,`content`,`points`,`editorId`,`userId`,`accepted`,`createdAt`,`updatedAt`)
            //  VALUES (DEFAULT,?,?,?,?,?,?,?,?,?);
            movieReview = await MovieReview.create({
                movieId: movieId,
                introduction: introduction,
                content: content,
                points: rating,
                editorId: 0,
                userId: userId,
                accepted: false
            });
        }
        else {
            throw Error("no editor or user");
        }

        res.status(201).json({ review: movieReview });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ error: err });
    }
};

const accept_review = async (req, res) => {
    const id = req.params.id;
    console.log(id);
    // UPDATE `MovieReviews` SET `accepted`=?,`updatedAt`=? WHERE `id` = ?
    await MovieReview.update({
        accepted: true
    },{
        where: { id: id }
    })
    .then(result => {
        res.status(201).json({ redirect: "/admin/reviews" });
    })
    .catch(err => console.log(err));
};

const delete_review = async (req, res) => {
    const id = req.params.id;
    console.log(id);
    // DELETE FROM `MovieReviews` WHERE `id` = '1'
    await MovieReview.destroy({
        where: { id: id }
    })
    .then(result => res.json({ redirect: "/" }))
    .catch(err => console.log(err));
};

module.exports = {
    add_movie_get,
    add_movie_post,
    movie_details,
    movie_accept,
    movie_update,
    movie_delete,
    add_rating,
    add_to_favourites,
    add_review_get,
    add_review_post,
    accept_review,
    delete_review
};