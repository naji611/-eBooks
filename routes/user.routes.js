const express = require("express");
const router = express.Router();
const isAuth = require("../middlewares/isAuth.middleware");
const userController = require("../Controllers/user.controller");
router.get("/:id", isAuth, userController.userProfile);
router.get("/favorite", isAuth);
module.exports = router;
