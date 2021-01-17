/*jshint esversion: 8*/

const Album = require("../models/Album");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AlbumRating = require("../models/AlbumRating");

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

const add_album_get = (req, res) => {
    res.render("music/albums/add", { title: "Dodaj album" });
};

const add_album_post = async (req, res) => {
    const { title, artist, genre, year } = req.body;
    const coverPath = "/images/albums/" + req.file.filename;
    console.log(coverPath);

    try {
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

    try {
        const albums = await Album.findAll({ where: 
            { 
                id: id,
                accepted: true
            } 
        });

        const userId = getUserId(req);
        let ratings;

        if (userId) {
            ratings = await AlbumRating.findAll({ where:
                {
                    albumId: id,
                    userId: userId 
                }
            });
        }

        if (albums && ratings) {
            res.render("music/albums/details", { title: albums[0].title, album: albums[0],
                rating: ratings[0]});
        }
        else if (albums[0]) {
            res.render("music/albums/details", { title: albums[0].title, album: albums[0],
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

const album_accept = async (req, res) => {
    const id = req.params.id;
    console.log(id);

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

    const albums = await Album.findAll({ where: { id: id }});
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

    await Album.destroy({
        where: { id: id }
    })
    .then(result => res.json({ redirect: "/admin/albums" }))
    .catch(err => console.log(err));
};

const add_rating = async (req, res) => {
    const { rating, albumId, userId } = req.body;
    
    try {
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

module.exports = {
    getUserId,
    add_album_get,
    add_album_post,
    album_details,
    album_accept,
    album_update,
    album_delete,
    add_rating
};