const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://akatarapu:9lTx4F85WKw5bnEU@cluster0.ggbel.mongodb.net/deep', {
  // useNewUrlParser: true, // These options are deprecated in MongoDB Driver 4.x
  // useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected!'))
.catch(err => console.log(err));

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  emergencyContacts: { type: [String], required: true }
});

const User = mongoose.model('User', userSchema);

// Route for handling user signup
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Ensure this function is async
app.post('/signup', async (req, res) => {
  console.log('Request body:', req.body); // Log the request body for debugging
  const { name, email, phone, username, password, emergencyContact1, emergencyContact2 } = req.body; // Extract email and password from the request body

  // Check if password is defined
  if (!password) {
    return res.status(400).send('Password is required.');
  }

  try {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document and save it to the database
    const newUser = new User({
      name: name,
      email: email,
      phone: phone,
      username: username,
      password: hashedPassword,
      emergencyContacts: [emergencyContact1, emergencyContact2] // Store as an array
    });

    await newUser.save(); // Save the user to the database
    console.log('User registered:', newUser);
    res.send('User registered successfully!'); // Success message
  } catch (err) {
    console.error('Error details:', err); // Log the error for debugging
    if (err.code === 11000) { // Duplicate key error
      return res.status(400).send('Email already registered.'); // Handle duplicate email
    }
    res.status(500).send('Error registering new user. Please try again.'); // Generic error message
  }
});

// Route for handling user login
app.post('/login', async (req, res) => {
  const { email, password } = req.body; // Get email and password from form

  try {
    // Check if the user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send('User not found.');
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send('Invalid credentials.');
    }

    // Successful login
    res.send('Login successful!');
    // You can also redirect to a new page or store session info
  } catch (err) {
    res.status(500).send('Error during login. Please try again.');
  }
});


// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

// Logout button functionality
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('logoutButton').addEventListener('click', function () {
        // Clear the logged-in user from localStorage
        localStorage.removeItem('loggedInUser');

        // Optionally, you can redirect to the login page
        alert('You have been logged out.');
        window.location.href = 'login/login.html'; // Redirect to the login page
    });
});
