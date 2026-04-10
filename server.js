const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// ===== DATABASE CONNECTION =====
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected!'))
    .catch(err => console.log(err));

// ===== SCHEMAS =====
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    emergencyContacts: { type: [String], required: true },
    createdAt: { type: Date, default: Date.now }
});

const connectionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    connectedUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

const chatMessageSchema = new mongoose.Schema({
    role: { type: String, required: true },
    content: { type: String, required: true },
    topEmotions: { type: Array, default: [] },
    createdAt: { type: Date, default: Date.now }
});

const chatSessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    humeChatGroupId: { type: String },
    messages: [chatMessageSchema],
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date }
});

const User = mongoose.model('User', userSchema);
const Connection = mongoose.model('Connection', connectionSchema);
const ChatSession = mongoose.model('ChatSession', chatSessionSchema);

// ===== AUTH MIDDLEWARE =====
function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
}

// ===== AUTH ROUTES =====

// Signup
app.post('/api/signup', async (req, res) => {
    const { name, phone, username, password, emergencyContact1, emergencyContact2 } = req.body;

    try {
        const existing = await User.findOne({ username });
        if (existing) return res.status(400).json({ error: 'Username already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            phone,
            username,
            password: hashedPassword,
            emergencyContacts: [emergencyContact1, emergencyContact2]
        });

        const token = jwt.sign(
            { id: newUser._id, username: newUser.username },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ token, user: { id: newUser._id, username: newUser.username, name: newUser.name } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Signup failed' });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ error: 'Invalid username or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid username or password' });

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ token, user: { id: user._id, username: user.username, name: user.name } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Get current user
app.get('/api/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// ===== CONNECTIONS ROUTES =====

// Get connections
app.get('/api/connections', authenticateToken, async (req, res) => {
    try {
        const connections = await Connection.find({ userId: req.user.id })
            .populate('connectedUserId', 'username name');
        res.json(connections.map(c => c.connectedUserId));
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch connections' });
    }
});

// Add connection
app.post('/api/connections', authenticateToken, async (req, res) => {
    const { connectedUsername } = req.body;
    try {
        const connectedUser = await User.findOne({ username: connectedUsername });
        if (!connectedUser) return res.status(404).json({ error: 'User not found' });

        await Connection.findOneAndUpdate(
            { userId: req.user.id, connectedUserId: connectedUser._id },
            { userId: req.user.id, connectedUserId: connectedUser._id },
            { upsert: true }
        );

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add connection' });
    }
});

// ===== CHAT HISTORY ROUTES =====

// Start a new session
app.post('/api/chat/session', authenticateToken, async (req, res) => {
    const { humeChatGroupId } = req.body;
    try {
        const session = await ChatSession.create({
            userId: req.user.id,
            humeChatGroupId
        });
        res.json({ sessionId: session._id });
    } catch (err) {
        res.status(500).json({ error: 'Failed to start session' });
    }
});

// Save a message to a session
app.post('/api/chat/message', authenticateToken, async (req, res) => {
    const { sessionId, role, content, topEmotions } = req.body;
    try {
        await ChatSession.findByIdAndUpdate(sessionId, {
            $push: { messages: { role, content, topEmotions } }
        });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save message' });
    }
});

// End a session
app.patch('/api/chat/session/:id/end', authenticateToken, async (req, res) => {
    try {
        await ChatSession.findByIdAndUpdate(req.params.id, { endedAt: new Date() });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to end session' });
    }
});

// Get full chat history
app.get('/api/chat/history', authenticateToken, async (req, res) => {
    try {
        const history = await ChatSession.find({ userId: req.user.id })
            .sort({ startedAt: -1 });
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

// ===== START SERVER =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));