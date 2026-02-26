const mongoose = require('mongoose');

// MONGODB_URI must be set as a Vercel Environment Variable — never hardcoded
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not defined. Add it in Vercel project settings.');
}

// Cache the database connection across serverless invocations
let cachedConnection = null;

async function connectToDatabase() {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }
  const connection = await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    maxPoolSize: 10,
  });
  cachedConnection = connection;
  return connection;
}

const scoreSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  score: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  totalQuestions: { type: Number, default: 10 },
  correctAnswers: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
});

const Score = mongoose.models.Score || mongoose.model('Score', scoreSchema);

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectToDatabase();

    if (req.method === 'GET') {
      const scores = await Score.find()
        .sort({ score: -1, date: 1 })
        .limit(20)
        .lean();
      return res.status(200).json(scores);

    } else if (req.method === 'POST') {
      const { name, score, accuracy, totalQuestions, correctAnswers } = req.body;
      if (!name || score === undefined || accuracy === undefined) {
        return res.status(400).json({ error: 'Missing required fields: name, score, accuracy' });
      }
      const newScore = new Score({ name, score, accuracy, totalQuestions, correctAnswers });
      const saved = await newScore.save();
      return res.status(201).json(saved);

    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};
