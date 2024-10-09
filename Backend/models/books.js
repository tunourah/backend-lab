import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    editionNumber: { type: Number, required: true },
    publicationDate: { type: String, required: true },  
    hasEbook: { type: Boolean, required: true },
    price: { type: Number, required: true },
    languages: { type: [String], required: true },
    category: { type: String, required: true },
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);
export default Book;
