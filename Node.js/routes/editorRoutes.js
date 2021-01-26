/*jshint esversion: 8*/

const express = require("express");
const router = express.Router();
const editorController = require("../controllers/editorController");
const { requireEditorAuth } = require("../middleware/authMiddleware");

router.get("/", requireEditorAuth, editorController.editor_index);

router.get("/articles", requireEditorAuth,  editorController.editor_articles);
router.get("/articles/:id", requireEditorAuth, editorController.edit_articles);

router.post("/signup", editorController.signup_post);
router.get("/login", editorController.login_get);
router.post("/login", editorController.login_post);
router.get("/logout", editorController.logout_get);

module.exports = router;