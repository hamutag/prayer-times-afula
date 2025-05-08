const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT ||10000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/times', async (req, res) => {
  try {
    const url = 'https://www.hebcal.com/hebcal?cfg=html&geonameid=295530&v=1&maj=on&ss=on&mf=on&c=on';
    const response = await fetch(url);
    const text = await response.text();

    const extractTime = (label) => {
      const match = text.match(new RegExp(`${label}</td>\s*<td[^>]*>([0-9:]+)</td>`));
      return match ? match[1] : null;
    };

    const sunrise = extractTime("נץ החמה");
    const sunset = extractTime("שקיעה");
    const tzeit = extractTime("צאת הכוכבים");

    const jsonResponse = await fetch('https://www.hebcal.com/hebcal?cfg=json&geonameid=295530&v=1&maj=on&ss=on&mf=on&c=on');
    const data = await jsonResponse.json();

    res.json({
      sunrise,
      sunset,
      tzeit,
      items: data.items
    });
  } catch (error) {
    console.error('Error fetching times:', error);
    res.status(500).json({ error: 'Failed to fetch times' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
