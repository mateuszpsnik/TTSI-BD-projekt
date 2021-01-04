/*jshint esversion:8*/

const { Router } = require ("express");
const userController = require("../controllers/userController");
const router = Router();
const { requireAuth } = require("../middleware/authMiddleware");

router.get("/edit", requireAuth, userController.user_edit);
router.get("/:id", userController.user_details);

module.exports = router;