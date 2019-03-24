const express = require('express');
const multer = require("multer");
const auth = require("../middleware/auth");
const UserController = require("../controllers/UserController");
const router = new express.Router();

router.post('/users', UserController.createUser);
router.post("/users/login", UserController.loginUser);
router.post("/users/logout", auth, UserController.logoutUser);
router.post("/users/logout/all", auth, UserController.logoutAll);
router.get("/users/me", auth, UserController.readProfile);
router.patch("/users/me", auth, UserController.updateUser);
router.delete("/users/me", auth, UserController.deleteUser);

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return callback(new Error('File must be a image'));
        }

        callback(undefined, true);
    }
})
// Add Avatar to user
router.post("/users/me/avatar", auth, upload.single('avatar'), UserController.uploadAvatar, UserController.uploadError);
router.delete("/users/me/avatar", auth, UserController.deleteAvatar);
router.get("/users/:id/avatar", UserController.getAvatar);

module.exports = router;