const cookieParser = require('cookie-parser');
const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

// Parse form data
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Setup MySQL connection
console.log('🔧 Building DB connection with:');

const db = mysql.createConnection({
  host: '127.0.0.1',
  port: '3306', 
  user: 'root',
  password: 'AIRplane101!', // <= replace this
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

  // 🔒 Duplicate submission check
  if (req.cookies.survey_submitted) {
    return res.send("❌ You have already submitted this survey.");
  }

  console.log('✅ Survey submission received:');
  console.log(req.body);

  const { codename, age, location, gender, interests, comments } = req.body;

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

    // ✔ Set cookie to block future submissions
    res.cookie('survey_submitted', 'true', {
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
      httpOnly: false
    });

    res.send('Survey saved successfully! 🎉');
  });
});


// Start server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
