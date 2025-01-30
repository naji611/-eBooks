const Book = require("../models/book.model");
const User = require("../models/user.model");
const Favorite = require("../models/favorite.model");
const { S3, Bucket_name, randomImageName } = require("../util/awsClient");
const {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

exports.addBook = async (req, res, next) => {
  try {
    const { title, author, year, description } = req.body;
    if (!title || !author || !year || !description) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    if (!req.files.poster || !req.files.book) {
      return res.status(400).json({ message: "Please upload poster and book" });
    }
    console.log(req.files.poster[0].mimetype);
    const posterName = randomImageName();
    const BookName = randomImageName();

    const bookParams = {
      Bucket: Bucket_name,
      Key: `Books/${BookName}`,
      Body: req.files.book[0].buffer,
      ContentType: req.files.book[0].mimetype,
    };
    const posterParams = {
      Bucket: Bucket_name,
      Key: `BooksPoster/${posterName}`,
      Body: req.files.poster[0].buffer,
      ContentType: req.files.poster[0].mimetype,
    };
    const bookCommand = new PutObjectCommand(bookParams);
    const posterCommand = new PutObjectCommand(posterParams);
    await S3.send(bookCommand);
    await S3.send(posterCommand);
    const newBook = new Book({
      title: title,
      author: author,
      year: year,
      description: description,
      poster: posterName,
      file: BookName,
      uploadedBy: req.user.id,
    });
    await newBook.save();
    res.json({ message: "Book added successfully" });
    // console.log(bookParams);
  } catch (err) {
    console.log(err);
    next();
  }
};
exports.getBookById = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "No book found" });
    }
    const getBookParams = {
      Bucket: Bucket_name,
      Key: `Books/${book.file}`,
    };
    const getPosterParams = {
      Bucket: Bucket_name,
      Key: `BooksPoster/${book.poster}`,
    };
    const getBookCommand = new GetObjectCommand(getBookParams);
    const BookUrl = await getSignedUrl(S3, getBookCommand, {
      expiresIn: 10800,
    });
    const getBookPosterCommand = new GetObjectCommand(getPosterParams);
    const poster = await getSignedUrl(S3, getBookPosterCommand, {
      expiresIn: 10800,
    });

    res.status(200).json({
      id: book.id,
      title: book.title,
      author: book.author,
      year: book.year,
      description: book.description,
      file: BookUrl,
      poster: poster,
    });
  } catch (err) {
    console.log(err);
    next();
  }
};
exports.getBooks = async (req, res, next) => {
  try {
    const { page = 1, title, author, year } = req.query;
    const sort = {};
    console.log(sort);
    if (title) sort.title = 1;
    if (author) sort.author = 1;
    if (year) sort.year = 1;
    console.log(req.body);
    const books = await Book.find()
      .sort(sort)
      .skip((page - 1) * 10)
      .limit(10);
    const updatedBooks = [];
    for (const book of books) {
      const getBookParams = {
        Bucket: Bucket_name,
        Key: `Books/${book.file}`,
      };
      const getPosterParams = {
        Bucket: Bucket_name,
        Key: `BooksPoster/${book.poster}`,
      };
      const getBookCommand = new GetObjectCommand(getBookParams);
      const BookUrl = await getSignedUrl(S3, getBookCommand, {
        expiresIn: 10800,
      });
      const getBookPosterCommand = new GetObjectCommand(getPosterParams);
      const poster = await getSignedUrl(S3, getBookPosterCommand, {
        expiresIn: 10800,
      });
      // console.log(book);
      updatedBooks.push({
        id: book.id,
        title: book.title,
        author: book.author,
        year: book.year,
        description: book.description,
        file: BookUrl,
        poster: poster,
      });
    }
    res.status(200).json(updatedBooks);
  } catch (err) {
    console.log(err);
    next();
  }
};
exports.deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const bookParams = {
      Bucket: Bucket_name,
      Key: `Books/${book.file}`,
    };
    const bookCommand = new DeleteObjectCommand(bookParams);

    const posterParams = {
      Bucket: Bucket_name,
      Key: `BooksPoster/${book.poster}`,
    };
    const posterCommand = new DeleteObjectCommand(posterParams);

    await S3.send(bookCommand);
    await S3.send(posterCommand);

    await Book.findByIdAndDelete(id);

    res.status(204).json({
      message: `The Book has been deleted successfully`,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
exports.addToFavorite = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id;
    console.log(bookId);
    console.log(userId);
    let favorite = await Favorite.findOne({ user: userId });

    if (!favorite) {
      favorite = new Favorite({ user: userId, books: [bookId] }); // Now "favorite" can be reassigned
    } else {
      if (favorite.books.includes(bookId)) {
        return res
          .status(400)
          .json({ message: "Book is already in your favorites" });
      }
      favorite.books.push(bookId);
    }

    await favorite.save();
    res.status(201).json({ message: "Book added to your favorites" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
