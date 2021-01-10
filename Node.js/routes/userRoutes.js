/*jshint esversion:8*/

const { Router } = require ("express");
const userController = require("../controllers/userController");
const router = Router();
const { requireUserAuth } = require("../middleware/authMiddleware");

router.get("/edit", requireUserAuth, userController.user_edit);
router.get("/:id", userController.user_details);

module.exports = router;