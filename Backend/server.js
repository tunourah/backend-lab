import express from "express";
import mongoose from "mongoose";
import Book from "./models/books.js"; // Use correct import name
import User from "./models/User.js"; // Use correct import name
import dotenv from "dotenv";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

dotenv.config();
const app = express();
app.use(express.json());
const port = 1000;

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

function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) return res.status(401).json({ message: "Access Denied" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });

    req.user = user; // إضافة بيانات المستخدم إلى الطلب

    next();
  });
}
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already in use" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  await newUser.save();

  const token = jwt.sign(
    { id: newUser._id, email: newUser.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.status(201).json({
    message: "User registered successfully",
    user: newUser,
    token: token,
  });
});

// إنشاء Route لتسجيل الدخول (POST /login)
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // العثور على المستخدم بالبريد الإلكتروني
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // تحقق من كلمة المرور
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        // إنشاء رمز JWT
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // تعيين مدة انتهاء الرمز
        );

        // إعادة الاستجابة بنجاح تسجيل الدخول والرمز
        res.status(200).json({ message: 'Login successful', user, token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

app.post("/books", authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      console.log("User ID from token:", userId); // تحقق من أن معرف المستخدم صحيح
  
      const newBook = new Book({
        title: req.body.title,
        editionNumber: req.body.editionNumber,
        publicationDate: req.body.publicationDate,
        hasEbook: req.body.hasEbook,
        price: req.body.price,
        languages: req.body.languages,
        category: req.body.category,
        author: userId  
      });
  
      const savedBook = await newBook.save();
      res.status(200).json(savedBook);
    } catch (err) {
      console.error("Error saving book:", err);
      res.status(400).json({ error: "Failed to save book", details: err });
    }
  });
  

  
  

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
