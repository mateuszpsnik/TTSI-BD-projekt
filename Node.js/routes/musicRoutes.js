/*jshint esversion:8*/

const { Router } = require ("express");
const musicController = require("../controllers/musicController");
const router = Router();
const { requireAdminAuth } = require("../middleware/authMiddleware");

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images/albums/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


router.get("/albums/add", musicController.add_album_get);
router.post("/albums/add", upload.single("cover"), musicController.add_album_post);

router.get("/albums/:id", musicController.album_details);
router.patch("/albums/:id", requireAdminAuth, musicController.album_accept);
router.put("/albums/:id", requireAdminAuth, upload.single("cover"), musicController.album_update);
router.delete("/albums/:id", requireAdminAuth, musicController.album_delete);
router.post("/albums/:id/rate", musicController.add_rating);

module.exports = router;