/*jshint esversion:8*/

const { Router } = require ("express");
const userController = require("../controllers/userController");
const router = Router();
const { requireUserAuth } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images/users/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get("/edit", requireUserAuth, userController.user_edit);
router.put("/edit", requireUserAuth, upload.single("image"), userController.user_update);

router.get("/delete", requireUserAuth, userController.user_get_delete);


router.get("/:id", userController.user_details);
router.delete("/:id", requireUserAuth, userController.user_delete);

module.exports = router;