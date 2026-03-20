const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 5000;

// API route
app.get('/api', (req, res) => {
  res.json({ message: '🔥 API working' });
});

// Serve React build
app.use(express.static(path.join(__dirname, 'client', 'build')));

// Catch all → React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
