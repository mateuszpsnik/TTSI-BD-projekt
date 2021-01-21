/*jshint esversion:8*/

const { Router } = require ("express");
const moviesController = require("../controllers/moviesController");
const router = Router();
const { requireAdminAuth, requireAnyAuth } = require("../middleware/authMiddleware");

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images/movies/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


router.get("/add", moviesController.add_movie_get);
router.post("/add", upload.single("poster"), moviesController.add_movie_post);

router.get("/:id", moviesController.movie_details);
router.patch("/:id", requireAdminAuth, moviesController.movie_accept);
router.put("/:id", requireAdminAuth, upload.single("poster"), moviesController.movie_update);
router.delete("/:id", requireAdminAuth, moviesController.movie_delete);
router.post("/:id/rate", moviesController.add_rating);
router.get("/:id/review", requireAnyAuth, moviesController.add_review_get);
router.post("/:id/review", requireAnyAuth, moviesController.add_review_post);
router.patch("/:id/accept-review", requireAdminAuth, moviesController.accept_review);
router.delete("/:id/review", requireAdminAuth, moviesController.delete_review);

module.exports = router;