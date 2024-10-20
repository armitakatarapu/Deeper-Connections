const express = require('express');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));


let users = [];


app.post('/signup', async (req, res) => {
  const { name, email, phone, username, password, emergencyContact1, emergencyContact2 } = req.body;

  
  if (!password) {
    return res.status(400).send('Password is required.');
  }

  try {
    
    const userExists = users.find(user => user.email === email || user.username === username);

    if (userExists) {
      return res.status(400).send('Email or username already exists.');
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
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


app.post('/login', async (req, res) => {
  const { usernameOrEmail, password } = req.body; 

  try {
    
    const user = users.find(user => user.email === usernameOrEmail || user.username === usernameOrEmail);

    if (!user) {
      return res.status(400).send('User not found.');
    }

    
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


app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
