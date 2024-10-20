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


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});


app.post('/signup', async (req, res) => {
  console.log('Request body:', req.body); 
  const { name, email, phone, username, password, emergencyContact1, emergencyContact2 } = req.body; 

  if (!password) {
    return res.status(400).send('Password is required.');
  }

  try {

    const hashedPassword = await bcrypt.hash(password, 10);

    
    const newUser = new User({
      name: name,
      email: email,
      phone: phone,
      username: username,
      password: hashedPassword,
      emergencyContacts: [emergencyContact1, emergencyContact2] 
    });

    await newUser.save(); 
    console.log('User registered:', newUser);
    res.send('User registered successfully!'); 
  } catch (err) {
    console.error('Error details:', err); 
    if (err.code === 11000) { 
      return res.status(400).send('Email already registered.'); 
    }
    res.status(500).send('Error registering new user. Please try again.'); 
  }
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body; 

  try {
 
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send('User not found.');
    }

    
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send('Invalid credentials.');
    }

    res.send('Login successful!');
   
  } catch (err) {
    res.status(500).send('Error during login. Please try again.');
  }
});



app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
