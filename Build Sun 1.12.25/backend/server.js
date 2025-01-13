// MERN Stack App - Entry Point

// 1. Create a basic file structure:
// backend/ -> Contains server-side code (Node.js, Express, MongoDB)
// frontend/ -> Contains client-side code (React)

// File: backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'your-secret-key';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/mern_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// User Schema
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const User = mongoose.model('User', UserSchema);

// Routes
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();
  res.status(201).send('User registered');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).send('User not found');

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return res.status(401).send('Invalid credentials');

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({ token });
});

app.get('/dashboard', (req, res) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('Token required');

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).send('Invalid token');
    res.status(200).send('Welcome to your dashboard!');
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
