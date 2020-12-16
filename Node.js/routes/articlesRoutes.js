/*jshint esversion: 8*/

const express = require("express");
const router = express.Router();
const articlesController = require("../controllers/articlesController");

router.get("/", articlesController.articles_index);

router.get("/:id", articlesController.article_details);

module.exports = router;