/*jshint esversion:8*/

const { Router } = require ("express");
const adminController = require("../controllers/adminController");
const router = Router();

router.post("/signup", adminController.signup_post);
router.get("/login", adminController.login_get);
router.post("/login", adminController.login_post);

module.exports = router;