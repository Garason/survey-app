const express = require('express');
const app = express();
const PORT = 3000;

// Middleware: allow Express to read form data (from <form> submits)
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Server is working 🎯');
});

// This route will handle your survey form submissions
app.post('/submit-survey', (req, res) => {
  console.log('✅ Survey submission received:');
  console.log(req.body); // This will contain your form fields

  // Send a simple response back to the browser
  res.send('Thanks for submitting the survey!');
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
