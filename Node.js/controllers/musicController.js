/*jshint esversion: 8*/

const Album = require("../models/Album");
const fs = require("fs");

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

    await Album.findAll({ where: 
        { 
            id: id,
            accepted: true
        } 
    })
    .then(result => {
        res.render("music/albums/details", { title: result[0].title, album: result[0] });
    })
    .catch(err => {
        console.log(err);
    });
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

module.exports = {
    add_album_get,
    add_album_post,
    album_details,
    album_accept,
    album_update,
    album_delete
};