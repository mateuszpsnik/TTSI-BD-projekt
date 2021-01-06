/*jshint esversion: 8*/

const express = require("express");
const router = express.Router();
const editorController = require("../controllers/editorController");

router.get("/", editorController.editor_index);

module.exports = router;