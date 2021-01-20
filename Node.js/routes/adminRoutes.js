/*jshint esversion:8*/

const { Router } = require ("express");
const adminController = require("../controllers/adminController");
const router = Router();
const { requireAdminAuth } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const { route } = require("./musicRoutes");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images/articles/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.get("/", requireAdminAuth, adminController.admin_index);

router.get("/users", requireAdminAuth, adminController.admin_users);

router.get("/albums", requireAdminAuth, adminController.albums_index);
router.get("/albums/:id", requireAdminAuth, adminController.album_edit);

router.get("/movies", requireAdminAuth,  adminController.movies_index);
router.get("/movies/:id",  requireAdminAuth, adminController.movie_edit);

router.get("/articles", requireAdminAuth, adminController.articles_index);
router.get("/articles/:id", requireAdminAuth, adminController.articles_edit);

router.get("/reviews", requireAdminAuth, adminController.reviews_index);
router.get("/reviews/albums/:id", requireAdminAuth, adminController.accept_album_review);

router.get("/signup", adminController.signup_get);
router.post("/signup", adminController.signup_post);
router.get("/login", adminController.login_get);
router.post("/login", adminController.login_post);
router.get("/logout", adminController.logout_get);

module.exports = router;