const express = require('express');
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

// API route
app.get('/api', (req, res) => {
  res.json({ message: '🔥 Backend working' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
