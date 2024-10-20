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
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Route for handling user signup
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'signIn.html'));
});

// Ensure this function is async
app.post('/signup', async (req, res) => {
  console.log('Request body:', req.body); // Log the request body for debugging
  const { email, password } = req.body; // Extract email and password from the request body

  // Check if password is defined
  if (!password) {
    return res.status(400).send('Password is required.');
  }

  try {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document and save it to the database
    const newUser = new User({
      email: email,
      password: hashedPassword
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

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
