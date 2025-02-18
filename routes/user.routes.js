const express = require("express");
const router = express.Router();
const isAuth = require("../middlewares/isAuth.middleware");
const userController = require("../Controllers/user.controller");
router.get("/:id", isAuth, userController.userProfile);
router.get("/favorite", isAuth);
router.get("/wee",(req,res,next)=>{
    res.send(`<html>
    <body></body>
    <h1>Hello from webhook</h1>
    </html>`)
})
module.exports = router;
