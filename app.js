const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Sample data
let items = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' }
];

// Authentication middleware
const authenticate = (req, res, next) => {
  const { token } = req.cookies;
  if (token && token === 'mysecrettoken') {
    next();
  } else {
    res.sendStatus(401);
  }
};

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Perform authentication here
  // Example: Check if username and password match a user in the database

  if (username === 'admin' && password === 'password') {
    res.cookie('token', 'mysecrettoken');
    res.send('Logged in successfully!');
  } else {
    res.sendStatus(401);
  }
});

// Logout route
app.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.send('Logged out successfully!');
});

// Get all items route
app.get('/items', authenticate, (req, res) => {
  res.json(items);
});

// Get item by ID route
app.get('/items/:id', authenticate, (req, res) => {
  const { id } = req.params;
  const item = items.find((item) => item.id === parseInt(id));
  if (item) {
    res.json(item);
  } else {
    res.sendStatus(404);
  }
});

// Add item route
app.post('/items', authenticate, (req, res) => {
  const { name } = req.body;
  const newItem = { id: items.length + 1, name };
  items.push(newItem);
  res.status(201).json(newItem);
});

// Update item route
app.put('/items/:id', authenticate, (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const item = items.find((item) => item.id === parseInt(id));
  if (item) {
    item.name = name;
    res.json(item);
  } else {
    res.sendStatus(404);
  }
});

// Delete item route
app.delete('/items/:id', authenticate, (req, res) => {
  const { id } = req.params;
  const index = items.findIndex((item) => item.id === parseInt(id));
  if (index !== -1) {
    const deletedItem = items.splice(index, 1)[0];
    res.json(deletedItem);
  } else {
    res.sendStatus(404);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
