/*jshint esversion: 8*/

const express = require("express");
const router = express.Router();
const articlesController = require("../controllers/articlesController");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images/articles/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get("/", articlesController.articles_index);

router.post("/create", upload.single("image"), articlesController.article_create);

router.get("/:id", articlesController.article_details);

module.exports = router;