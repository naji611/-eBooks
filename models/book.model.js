const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookSchema = new Schema(
  {
    title: { type: String, required: true }, // Title of the book (required)
    author: { type: String, required: true }, // Author of the book (required)
    year: { type: Number }, // Year of publication
    poster: { type: String }, // URL of the book cover image (stored in AWS S3 or similar)
    description: { type: String }, // Short description of the book
    file: { type: String, required: true }, // URL of the book file (PDF stored in AWS S3)
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Reference to the user who uploaded the book
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
