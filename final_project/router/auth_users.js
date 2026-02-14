const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    return users.some(user => user.username === username);
};
    const authenticatedUser = (username, password) => {
        return users.some(user => user.username === username && user.password === password);
    };

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both fields are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if credentials match a registered user
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign(
            { data: username },
            "access",
            { expiresIn: "1h" }
        );

        req.session.authorization = {
            accessToken,
            username
        };

        return res.status(200).json({ message: "Login successful" });
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization?.username;

    // User must be logged in
    if (!username) {
        return res.status(401).json({ message: "User not logged in" });
    }

    // Review must be provided
    if (!review) {
        return res.status(400).json({ message: "Review is required" });
    }

    // Book must exist
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }
    regd_users.delete("/auth/review/:isbn", (req, res) => {
        const isbn = req.params.isbn;
        const username = req.session.authorization?.username;
    
        // User must be logged in
        if (!username) {
            return res.status(401).json({ message: "User not logged in" });
        }
    
        // Book must exist
        if (!books[isbn]) {
            return res.status(404).json({ message: "Book not found" });
        }
    
        // Check if this user has a review to delete
        if (!books[isbn].reviews[username]) {
            return res.status(404).json({ message: "No review by this user to delete" });
        }
    
        // Delete the user's review
        delete books[isbn].reviews[username];
    
        return res.status(200).json({ message: "Review deleted successfully" });
    });
    // Add or update review under this username
    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: "Review added/updated successfully" });
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
