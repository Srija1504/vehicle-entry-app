const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const db = require('./db'); // Make sure you have db.js in the same folder
const app = express();
const SECRET = 'vehicle_app_secret';
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('✅ Vehicle Entry Backend is Running');
});

// Register user
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], function(err) {
    if (err) return res.status(400).json({ error: 'User already exists' });
    res.json({ message: 'User registered' });
  });
});

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, user) => {
    if (user) {
      const token = jwt.sign({ id: user.id, username: user.username }, SECRET);
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });
});

// Middleware to verify token
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Save vehicle entry
app.post('/api/vehicle', authenticateToken, (req, res) => {
  const { vehicleNumber, fitnessDate, insuranceDate, permitDate, taxDate, mobile, owner } = req.body;
  db.run(
    'INSERT INTO vehicles (userId, vehicleNumber, fitnessDate, insuranceDate, permitDate, taxDate, mobile, owner) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [req.user.id, vehicleNumber, fitnessDate, insuranceDate, permitDate, taxDate, mobile, owner],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Vehicle entry saved' });
    }
  );
});

// Get all vehicles
app.get('/api/vehicles', authenticateToken, (req, res) => {
  db.all('SELECT * FROM vehicles WHERE userId = ?', [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
