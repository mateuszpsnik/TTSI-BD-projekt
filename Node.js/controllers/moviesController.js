/*jshint esversion: 8*/

const Movie = require("../models/Movie");
const fs = require("fs");
const { getUserId } = require("./userController");
const MovieRating = require("../models/MovieRating");

const add_movie_get = (req, res) => {
    res.render("movies/add", { title: "Dodaj Movies" });
};

const add_movie_post = async (req, res) => {
    const { title, director, genre, year } = req.body;
    const posterPath = "/images/movies/" + req.file.filename;
    console.log(posterPath);

    try {
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
        const movies = await Movie.findAll({ where: 
            { 
                id: id,
                accepted: true
            } 
        });

        const userId = getUserId(req);
        let ratings;

        if (userId) {
            ratings = await MovieRating.findAll({ where:
                {
                    movieId: id,
                    userId: userId 
                }
            });
        }

        if (movies && ratings) {
            res.render("movies/details", { title: movies[0].title, movie: movies[0],
                rating: ratings[0]});
        }
        else if (movies[0]) {
            res.render("movies/details", { title: movies[0].title, movie: movies[0],
                rating: false});
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

    const movies = await Movie.findAll({ where: { id: id }});
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

    await Movie.destroy({
        where: { id: id }
    })
    .then(result => res.json({ redirect: "/admin/movies" }))
    .catch(err => console.log(err));
};

const add_rating = async (req, res) => {
    const { rating, movieId, userId } = req.body;
    
    try {
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

module.exports = {
    add_movie_get,
    add_movie_post,
    movie_details,
    movie_accept,
    movie_update,
    movie_delete,
    add_rating
};