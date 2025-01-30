const mongoose = require("mongoose");
const { Schema } = mongoose;

const favoriteSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  books: [
    {
      type: Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
});

module.exports = mongoose.model("Favorite", favoriteSchema);
