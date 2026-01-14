const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const dataFile = path.join(__dirname, 'data.json');

// Default data
const defaultData = [
  [677, 400, 160],
  [8, 169, 13],
  [3115, 1504, 242]
];

// Load data
function loadData() {
  try {
    if (fs.existsSync(dataFile)) {
      const data = fs.readFileSync(dataFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading data:', err);
  }
  return defaultData;
}

// Save data
function saveData(data) {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error saving data:', err);
  }
}

// Routes
app.get('/data', (req, res) => {
  res.json(loadData());
});

app.post('/data', (req, res) => {
  const newData = req.body;
  if (Array.isArray(newData) && newData.length === 3 && newData.every(arr => Array.isArray(arr) && arr.length === 3)) {
    saveData(newData);
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, message: 'Invalid data format' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});