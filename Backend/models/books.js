import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  editionNumber: { type: Number, required: true },

  hasEbook: { type: Boolean },
  price: { type: Number },
  languages: { type: [String] },
  category: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Book = mongoose.model("Book", bookSchema);
export default Book;
