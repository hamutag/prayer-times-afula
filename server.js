const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/times', async (req, res) => {
  try {
    const url = 'https://www.hebcal.com/hebcal?cfg=json&geonameid=295530&v=1&maj=on&ss=on&mf=on&c=on';
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch times' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
