const express = require('express');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

// In-memory array to store users temporarily
let users = [];

// Route for handling user signup
app.post('/signup', async (req, res) => {
  const { name, email, phone, username, password, emergencyContact1, emergencyContact2 } = req.body;

  // Check if password is provided
  if (!password) {
    return res.status(400).send('Password is required.');
  }

  try {
    // Check if the username or email already exists
    const userExists = users.find(user => user.email === email || user.username === username);

    if (userExists) {
      return res.status(400).send('Email or username already exists.');
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user and add to the in-memory array
    const newUser = {
      name,
      email,
      phone,
      username,
      password: hashedPassword,
      emergencyContacts: [emergencyContact1, emergencyContact2]
    };
    
    users.push(newUser);
    console.log('User registered:', newUser);

    res.send('User registered successfully!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error registering new user. Please try again.');
  }
});

// Route for handling user login
app.post('/login', async (req, res) => {
  const { usernameOrEmail, password } = req.body; // Change 'email' to 'usernameOrEmail'

  try {
    // Check if the user exists by username or email
    const user = users.find(user => user.email === usernameOrEmail || user.username === usernameOrEmail);

    if (!user) {
      return res.status(400).send('User not found.');
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).send('Invalid credentials.');
    }

    res.send('Login successful!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error during login. Please try again.');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
