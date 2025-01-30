const express = require("express");
require("dotenv").config();
const AuthRoutes = require("./routes/auth.routes");
const UserRoutes = require("./routes/user.routes");
const BooksRouter = require("./routes/eBook.routes");
const mongoose = require("mongoose");
const port = process.env.Port || 3000;
const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,PATCH,PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});
app.use("/auth", AuthRoutes);
app.use("/users", UserRoutes);
app.use("/books", BooksRouter);
app.use((req, res) => {
  res
    .status(404)
    .json({ message: `Cannot find${req.method} ${req.originalUrl}` });
});
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
