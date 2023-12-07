const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const apiKey = 'b8c77e5b21544f1066cac549cc616dfa';
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Route for fetching weather data
app.get('/weather', async (req, res) => {
    const { location } = req.query;
  
    if (!location) {
      return res.status(400).json({ error: 'Location parameter is missing' });
    }
  
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`;
  
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
  
      console.log('Response status:', response.status);
      console.log('Received data:', data);
  
      if (response.ok) {
        if (data && data.cod === 200) {
          res.json(data);
        } else {
          res.status(500).json({ error: 'Weather data not found' });
        }
      } else {
        res.status(response.status).json({ error: data.message });
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      res.status(500).json({ error: 'An error occurred while fetching weather data' });
    }
  });

// Route for the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
