/*jshint esversion: 8*/

const Album = require("../models/Album");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AlbumRating = require("../models/AlbumRating");
const { getUserId } = require("./userController");
const { getEditorId } = require("./editorController");
const AlbumReview = require("../models/AlbumReview");
const FavouriteAlbum = require("../models/FavouriteAlbum");
const { Sequelize } = require("../connection");
const Article = require("../models/Article");
const Movie = require("../models/Movie");

const index = async (req, res) => {
    // SELECT `id`, `image`, `title`, `introduction`, `category` FROM `Articles` AS `Article` WHERE `Article`.`category` = 'music' 
    // ORDER BY `Article`.`id` DESC LIMIT 3;
    const articles = await Article.findAll({
        attributes: [ "id", "image", "title", "introduction", "category" ],
        where: { category: "music" },
        order: [ 
            [ "id", "DESC" ]
        ],
        limit: 3
    });
    // SELECT `AlbumReview`.`id`, `AlbumReview`.`albumId`, `AlbumReview`.`introduction`, `AlbumReview`.`content`, `AlbumReview`.`points`, 
    // `AlbumReview`.`accepted`, `Album`.`id` AS `Album.id`, `Album`.`title` AS `Album.title`, `Album`.`cover` AS `Album.cover` 
    // FROM `AlbumReviews` AS `AlbumReview` LEFT OUTER JOIN `Albums` AS `Album` ON `AlbumReview`.`albumId` = `Album`.`id` 
    // WHERE `AlbumReview`.`accepted` = true ORDER BY `AlbumReview`.`id` DESC LIMIT 3;
    const lastAlbumReviews = await AlbumReview.findAll({
        attributes: [ "id", "albumId", "introduction", "content", "points", "accepted" ],
        include: [{
            model: Album,
            attributes: [ "id", "title", "cover" ]
        }],
        where: { accepted: true },
        order: [ 
            [ "id", "DESC" ]
        ],
        limit: 3 
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

    res.render("music/index", { title: "Muzyka i film - Strona główna", articles: articles,
            lastAlbumReviews: lastAlbumReviews, lastAlbum: lastAlbum[0], lastMovie: lastMovie[0], 
            randomAlbum: randomAlbum[0], randomMovie: randomMovie[0] });
};

const add_album_get = (req, res) => {
    res.render("music/albums/add", { title: "Dodaj album" });
};

const add_album_post = async (req, res) => {
    const { title, artist, genre, year } = req.body;
    const coverPath = "/images/albums/" + req.file.filename;
    console.log(coverPath);

    try {
        // INSERT INTO `Albums` (`id`,`title`,`artist`,`genre`,`year`,`cover`,`accepted`,`createdAt`,`updatedAt`)
        //  VALUES (DEFAULT,?,?,?,?,?,?,?,?);
        const album = await Album.create({
            title: title,
            artist: artist,
            genre: genre,
            year: year,
            cover: coverPath,
            accepted: false
        });

        res.status(201).json({ album: album.id });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ err });
    }
};

const album_details = async (req, res) => {
    const id = req.params.id;
    console.log(id);
    // SELECT `Album`.`id`, `Album`.`title`, `Album`.`artist`, `Album`.`genre`, `Album`.`year`, `Album`.`cover`, `Album`.`accepted`, 
    // `AlbumReviews`.`id` AS `AlbumReviews.id`, `AlbumReviews`.`albumId` AS `AlbumReviews.albumId`, `AlbumReviews`.`introduction` 
    // AS `AlbumReviews.introduction`, `AlbumReviews`.`content` AS `AlbumReviews.content`, `AlbumReviews`.`points` AS `AlbumReviews.points`, 
    // `AlbumReviews`.`editorId` AS `AlbumReviews.editorId`, `AlbumReviews`.`userId` AS `AlbumReviews.userId`, `AlbumReviews`.`accepted` 
    // AS `AlbumReviews.accepted` FROM `Albums` AS `Album` LEFT OUTER JOIN `AlbumReviews` AS `AlbumReviews` ON `Album`.`id` = `AlbumReviews`.`albumId` 
    // AND `AlbumReviews`.`albumId` = '1' WHERE `Album`.`id` = '1' AND `Album`.`accepted` = true;
    try {
        const albums = await Album.findAll({ 
            attributes: { 
                exclude: [ "createdAt", "updatedAt" ]
            },
            where: { 
                id: id,
                accepted: true
            },
            include: [{
                model: AlbumReview,
                where: { albumId: id },
                attributes: {
                    exclude: [ "createdAt", "updatedAt" ]
                },
                required: false
            }] 
        });

        const userId = getUserId(req);
        let ratings = [ false ];
        let reviews = [ false ];

        if (albums[0]) {
            reviews = albums[0].AlbumReviews;
        }

        if (userId) {
            // SELECT `id`, `points` FROM `AlbumRatings` AS `AlbumRating` WHERE `AlbumRating`.`albumId` = '1' AND `AlbumRating`.`userId` = 1;
            ratings = await AlbumRating.findAll({ 
                attributes: [ "id", "points" ],
                where: {
                    albumId: id,
                    userId: userId 
                }
            });
        }

        if (albums[0]) {
            res.render("music/albums/details", { title: albums[0].title, album: albums[0],
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

const album_accept = async (req, res) => {
    const id = req.params.id;
    console.log(id);

    // UPDATE `Albums` SET `accepted`=?,`updatedAt`=? WHERE `id` = ?
    await Album.update({
        accepted: true
    },{
        where: { id: id }
    })
    .then(result => {
        res.status(201).json({ redirect: "/admin/albums" });
    })
    .catch(err => console.log(err));
};

const album_update = async (req, res) => {
    const { id, title, artist, genre, year } = req.body;
    // SELECT `id`, `cover` FROM `Albums` AS `Album` WHERE `Album`.`id` = '1';
    const albums = await Album.findAll({
        attributes: [ "id", "cover" ], 
        where: { id: id }
    });
    const albumToBeUpdated = albums[0];

    console.log(req.file);

    let coverPath; 
    if (req.file) {
        coverPath = "/images/albums/" + req.file.filename;
        console.log(coverPath);
        fs.unlinkSync("public" + albumToBeUpdated.cover, (err) => {
            if (err) {
                throw Error(err);
            }
        });
    }

    try {
        let album;
        if (req.file) {
            coverPath = "/images/albums/" + req.file.filename;
            // UPDATE `Albums` SET `title`=?,`artist`=?,`genre`=?,`year`=?,`cover`=?,`updatedAt`=? WHERE `id` = ?
            album = await Album.update({
                title: title,
                artist: artist,
                genre: genre,
                year: year,
                cover: coverPath
            },{
                where: { id: id }
            });
        } else {
            // UPDATE `Albums` SET `title`=?,`artist`=?,`genre`=?,`year`=?,updatedAt`=? WHERE `id` = ?
            album = await Album.update({
                title: title,
                artist: artist,
                genre: genre,
                year: year
            },{
                where: { id: id }
            });
        }

        res.status(201).json({ album: album.id });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ error: err });
    }
};

const album_delete = async (req, res) => {
    const id = req.params.id;
    console.log(id);
    // DELETE FROM `Albums` WHERE `id` = '1'
    await Album.destroy({
        where: { id: id }
    })
    .then(result => res.json({ redirect: "/admin/albums" }))
    .catch(err => console.log(err));
};

const add_rating = async (req, res) => {
    const { rating, albumId } = req.body;
    const userId = getUserId(req);
    
    try {
        // INSERT INTO `AlbumRatings` (`id`,`points`,`albumId`,`userId`,`createdAt`,`updatedAt`) VALUES (DEFAULT,?,?,?,?,?);
        const albumRating = await AlbumRating.create({
            points: rating,
            albumId: albumId,
            userId: userId
        });

        res.status(201).json({ rating: albumRating });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ error: err });
    }
};

const add_to_favourites = async (req, res) => {
    const albumId = req.params.id;
    const userId = getUserId(req);
    // INSERT INTO `FavouriteAlbums` (`id`,`albumId`,`userId`,`createdAt`,`updatedAt`) VALUES (DEFAULT,?,?,?,?);
    await FavouriteAlbum.create({
        albumId: albumId,
        userId: userId
    });
};

const add_review_get = (req, res) => {
    const albumId = req.params.id;

    res.render("music/albums/addReview.ejs", { title: "Dodaj recenzję", albumId: albumId });
};

const add_review_post = async (req, res) => {
    const { introduction, content, rating, albumId } = req.body;
    const userId = getUserId(req);
    const editorId = getEditorId(req);

    try {
        let albumReview;
        if (editorId) {
            console.log("editor");
            // INSERT INTO `AlbumReviews` (`id`,`albumId`,`introduction`,`content`,`points`,`editorId`,`userId`,`accepted`,`createdAt`,`updatedAt`)
            //  VALUES (DEFAULT,?,?,?,?,?,?,?,?,?);
            albumReview = await AlbumReview.create({
                albumId: albumId,
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
            // INSERT INTO `AlbumReviews` (`id`,`albumId`,`introduction`,`content`,`points`,`editorId`,`userId`,`accepted`,`createdAt`,`updatedAt`)
            //  VALUES (DEFAULT,?,?,?,?,?,?,?,?,?);
            albumReview = await AlbumReview.create({
                albumId: albumId,
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

        res.status(201).json({ review: albumReview });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ error: err });
    }
};

const accept_review = async (req, res) => {
    const id = req.params.id;
    console.log(id);
    // UPDATE `Albums` SET `accepted`=?,`updatedAt`=? WHERE `id` = ?
    await AlbumReview.update({
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
    // DELETE FROM `AlbumReviews` WHERE `id` = '1'
    await AlbumReview.destroy({
        where: { id: id }
    })
    .then(result => res.json({ redirect: "/" }))
    .catch(err => console.log(err));
};

module.exports = {
    index,
    add_album_get,
    add_album_post,
    album_details,
    album_accept,
    album_update,
    album_delete,
    add_rating,
    add_to_favourites,
    add_review_get,
    add_review_post,
    accept_review,
    delete_review
};