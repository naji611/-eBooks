const express = require("express");
const router = express.Router();
const isAuth = require("../middlewares/isAuth.middleware");
const booksControllers = require("../Controllers/eBook.controller");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
router.post(
  "/uploadBook",
  isAuth,
  upload.fields([
    { name: "poster", maxCount: 1 },
    { name: "book", maxCount: 1 },
  ]),
  booksControllers.addBook
);
router.get("/allBooks", isAuth, booksControllers.getBooks);
router.get("/:id", isAuth, booksControllers.getBookById);
router.delete("/:id", isAuth, booksControllers.deleteBook);
router.get("/addToFav/:bookId", isAuth, booksControllers.addToFavorite);
module.exports = router;
