/*jshint esversion:8*/

const { Router } = require ("express");
const adminController = require("../controllers/adminController");
const { requireAuth } = require("../middleware/authMiddleware");
const router = Router();
const { requireAdminAuth } = require("../middleware/authMiddleware");

router.get("/", requireAdminAuth, adminController.admin_index);

router.get("/signup", adminController.signup_get);
router.post("/signup", adminController.signup_post);
router.get("/login", adminController.login_get);
router.post("/login", adminController.login_post);
router.get("/logout", adminController.logout_get);

module.exports = router;