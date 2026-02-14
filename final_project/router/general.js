const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    const userExists = users.some(user => user.username === username);

    if (userExists) {
        return res.status(409).json({ message: "Username already exists" });
    }

    users.push({ username: username, password: password });

    return res.status(200).json({ message: "User registered successfully" });
});// Get the book list available in the shop
public_users.get('/books', function (req, res) {
return res.status(200).send(JSON.stringify(books, null, 2));});
const axios = require("axios");

// Task 10: Get book list using async/await with Axios
public_users.get('/books-async', async (req, res) => {
    try {
        const response = await axios.get("http://localhost:5000/books");
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});

// Get book details based on ISBN
    public_users.get('/isbn-async/:isbn', async (req, res) => {
        const isbn = req.params.isbn;
        const book = books[isbn];          // 2. Look up the book by key

        try {
            const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
            return res.status(200).json(response.data);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching book details" });
        }
    });
    // Get book details based on author
    public_users.get('/author-async/:author', async (req, res) => {
        const author = req.params.author;
    
        try {
            const response = await axios.get(`http://localhost:5000/author/${author}`);
            return res.status(200).json(response.data);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching books by author" });
        }
    });
    // Get all books based on title
    public_users.get('/title-async/:title', async (req, res) => {
        const title = req.params.title;
    
        try {
            const response = await axios.get(`http://localhost:5000/title/${title}`);
            return res.status(200).json(response.data);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching books by title" });
        }
    });
    

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Return the reviews for this ISBN
    return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
