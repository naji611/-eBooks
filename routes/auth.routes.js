const express = require("express");
const router = express.Router();
const authController = require("../Controllers/auth.controller");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/signUp", upload.single("profileImage"), authController.register);
router.post("/login", authController.login);
module.exports = router;
