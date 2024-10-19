const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://agampa:Deeper-Connections-Cal-Hacks@cluster0.ky94y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  /*useNewUrlParser: true,
  useUnifiedTopology: true, */
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Route for handling user signup
app.get('/', (req, res) => {
    res.sendFile(path.join(_dirname, 'signIn.html'));
  });

app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  // Hash the password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user document and save it to the database
  const newUser = new User({
    email: email,
    password: hashedPassword
  });

  newUser.save((err) => {
    if (err) {
      res.status(500).send('Error registering new user. Please try again.');
    } else {
      res.send('User registered successfully!');
    }
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
