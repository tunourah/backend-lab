import express from "express";
import mongoose from "mongoose";
import Book from "./models/books.js";  // Use correct import name
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());
const port = 3000;

async function main() {
    try {
        await mongoose.connect(process.env.MANGO_URL);
        console.log("Connected to MongoDB Atlas");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);  
    }
}
main();

// Get all books
app.get("/books", async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        console.error("Error fetching books:", err);
        res.status(500).json({ error: "Failed to fetch books", details: err });
    }
});

// Add a new book
app.post("/books", async (req, res) => {
    try {
        const newBook = new Book(req.body);  
        const savedBook = await newBook.save();
        res.status(200).json(savedBook);  
    } catch (err) {
        console.error("Error saving book:", err);  
        res.status(400).json({ error: "Failed to save book", details: err });
    }
});

// Get a book by ID
app.get("/books/:id", async (req, res) => {
    const bookId = req.params.id;
    try {
        const book = await Book.findById(bookId);
        if (book) {
            res.json(book);
        } else {
            res.status(404).send("Book not found");
        }
    } catch (err) {
        console.error("Error fetching book:", err);
        res.status(500).json({ error: "Failed to fetch book", details: err });
    }
});

// Delete a book
app.delete("/books/:id", async (req, res) => {
    const bookId = req.params.id;
    try {
        const book = await Book.findById(bookId);
        if (book) {
            await book.remove(); // Use remove() instead of delete()
            res.send("Book deleted");
        } else {
            res.status(404).send("Book not found");
        }
    } catch (err) {
        console.error("Error deleting book:", err);
        res.status(500).json({ error: "Failed to delete book", details: err });
    }
});

// Update a book
app.patch("/books/:id", async (req, res) => {
    const bookId = req.params.id;
    try {
        const book = await Book.findById(bookId);
        if (book) {
            book.set(req.body);
            const updatedBook = await book.save();
            res.json(updatedBook);
        } else {
            res.status(404).send("Book not found");
        }
    } catch (err) {
        console.error("Error updating book:", err);
        res.status(500).json({ error: "Failed to update book", details: err });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
