const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

// Parse form data
app.use(express.urlencoded({ extended: true }));

// Setup MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'YOUR_PASSWORD_HERE', // <= replace this
  database: 'survey_app'
});

db.connect(err => {
  if (err) {
    console.error('❌ MySQL connection failed:', err);
  } else {
    console.log('✅ Connected to MySQL database');
  }
});

// Test route
app.get('/', (req, res) => {
  res.send('Server is working 🎯');
});

// Survey submission route
app.post('/submit-survey', (req, res) => {
  console.log('✅ Survey submission received:');
  console.log(req.body);

  const { codename, age, location, gender, interests, comments } = req.body;

  // Convert interests array -> string
  const interestString = Array.isArray(interests)
    ? interests.join(', ')
    : interests;

  const sql = `
    INSERT INTO survey_responses
      (codename, age, location, gender, interests, comments)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [
    codename || null,
    age || null,
    location || null,
    gender || null,
    interestString || null,
    comments || null
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('❌ Database error:', err);
      return res.status(500).send('Error saving survey');
    }

    console.log('💾 Saved survey ID:', result.insertId);
    res.send('Survey saved successfully! 🎉');
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
