// routes/bookRoutes.js
import express from 'express';
import Book from '../models/books.js';
import { authenticateToken } from '../middleware/auth.js'; // Create a middleware for token authentication

const router = express.Router();

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).json({ error: "Failed to fetch books", details: err });
  }
});

// Add a new book
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const newBook = new Book({ ...req.body, author: userId });
    const savedBook = await newBook.save();
    res.status(200).json(savedBook);
  } catch (err) {
    console.error("Error saving book:", err);
    res.status(400).json({ error: "Failed to save book", details: err });
  }
});

// Get a book by ID
router.get('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
  const bookId = req.params.id;
  try {
    const book = await Book.findById(bookId);
    if (book) {
      await book.remove();
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
router.patch('/:id', async (req, res) => {
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

export default router;
