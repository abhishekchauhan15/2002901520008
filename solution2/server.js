const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Middleware to parse query parameters
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Helper function to retrieve numbers from a URL
async function getNumbersFromURL(url) {
  try {
    const response = await axios.get(url, { timeout: 500 });
    return response.data.numbers || [];
  } catch (error) {
    console.error('Error fetching numbers from', url, error.message);
    return [];
  }
}

// GET /numbers route
app.get('/numbers', async (req, res) => {
  const urls = req.query.url;

  if (!urls) {
    return res.status(400).json({ error: 'No URLs provided in the query parameter "url"' });
  }

  const urlArray = Array.isArray(urls) ? urls : [urls];
  const promises = [];

  urlArray.forEach((url) => {
    if (isValidURL(url)) {
      promises.push(getNumbersFromURL(url));
    }
  });

  try {
    const results = await Promise.allSettled(promises);

    const mergedNumbers = results
      .filter((result) => result.status === 'fulfilled' && Array.isArray(result.value))
      .flatMap((result) => result.value);

    const uniqueNumbers = Array.from(new Set(mergedNumbers)).sort((a, b) => a - b);

    res.json({ numbers: uniqueNumbers });
  } catch (error) {
    console.error('Error processing requests:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Helper function to check if a URL is valid
function isValidURL(str) {
  try {
    new URL(str);
    return true;
  } catch (error) {
    return false;
  }
}

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
