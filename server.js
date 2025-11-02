const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { validateRedGate } = require('./validators/red-gate');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ============================================
// CHALLENGE DATA FEED ENDPOINTS
// ============================================

/**
 * GET /api/challenges/red-gate
 * Returns the login attempts data for Red Gate challenge
 */
app.get('/api/challenges/red-gate', (req, res) => {
  try {
    const data = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'data/red-gate-feed.json'), 'utf8')
    );
    
    // Return only the data array, not the answer
    res.json({
      challenge: data.challenge,
      description: data.description,
      data: data.data,
      hints: data.hints
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load challenge data' });
  }
});

// ============================================
// VALIDATION ENDPOINTS
// ============================================

/**
 * POST /api/validate/lock-user
 * Validates the agent's decision to lock users
 * Body: { users: ["bob", "dave"], reasoning: "explanation..." }
 */
app.post('/api/validate/lock-user', (req, res) => {
  console.log('Validation request received:', req.body);
  
  const result = validateRedGate(req.body);
  
  // Log the result
  if (result.success) {
    console.log('✅ SUCCESS! Flag captured:', result.flag);
  } else {
    console.log('❌ FAILED:', result.message);
  }
  
  res.json(result);
});

// ============================================
// INFO ENDPOINTS
// ============================================

/**
 * GET /api/challenges
 * Lists all available challenges
 */
app.get('/api/challenges', (req, res) => {
  res.json({
    challenges: [
      {
        id: 'red-gate',
        name: 'Red Gate - Intrusion Detector',
        description: 'Detect brute-force login attempts and lock malicious users',
        difficulty: 'Easy',
        points: 100,
        endpoints: {
          data: '/api/challenges/red-gate',
          validation: '/api/validate/lock-user'
        }
      }
      // Future challenges can be added here
    ]
  });
});

/**
 * GET /health
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ 
    status: 'online',
    timestamp: new Date().toISOString(),
    challenges: ['red-gate']
  });
});

/**
 * GET /
 * Welcome message
 */
app.get('/', (req, res) => {
  res.json({
    message: '🧠 Agent Odyssey CTF Backend',
    version: '1.0.0',
    endpoints: {
      challenges: '/api/challenges',
      red_gate_data: '/api/challenges/red-gate',
      validation: '/api/validate/lock-user',
      health: '/health'
    },
    instructions: 'Build an AI agent in n8n that can analyze the challenge data and submit the correct answer to capture the flag!'
  });
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    available_endpoints: [
      'GET /',
      'GET /api/challenges',
      'GET /api/challenges/red-gate',
      'POST /api/validate/lock-user',
      'GET /health'
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log('');
  console.log('🚀 =====================================');
  console.log('🧠  Agent Odyssey CTF Backend');
  console.log('🚀 =====================================');
  console.log('');
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log('');
  console.log('📋 Available endpoints:');
  console.log(`   GET  http://localhost:${PORT}/api/challenges`);
  console.log(`   GET  http://localhost:${PORT}/api/challenges/red-gate`);
  console.log(`   POST http://localhost:${PORT}/api/validate/lock-user`);
  console.log('');
  console.log('🎯 Ready for agents to connect!');
  console.log('');
});

module.exports = app;
