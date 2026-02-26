const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sasankkandalam_db_user:i2ir8bJ0uqdsduUB@cluster0.s4ftxhs.mongodb.net/?appName=Cluster0';

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Leaderboard Schema
const scoreSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  score: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  totalQuestions: { type: Number, default: 10 },
  correctAnswers: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
});

const Score = mongoose.model('Score', scoreSchema);

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AZ Applications API is running' });
});

// Get leaderboard - top 20 scores
app.get('/api/leaderboard', async (req, res) => {
  try {
    const scores = await Score.find()
      .sort({ score: -1, date: 1 })
      .limit(20)
      .lean();
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Add a new score
app.post('/api/leaderboard', async (req, res) => {
  try {
    const { name, score, accuracy, totalQuestions, correctAnswers } = req.body;
    if (!name || score === undefined || accuracy === undefined) {
      return res.status(400).json({ error: 'Missing required fields: name, score, accuracy' });
    }
    const newScore = new Score({ name, score, accuracy, totalQuestions, correctAnswers });
    const saved = await newScore.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save score' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
