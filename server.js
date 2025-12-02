const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Server is working 🎯');
});

app.post('/submit-survey', (req, res) => {
  console.log('✅ Survey submission received:');
  console.log(req.body);
  res.send('Thanks for submitting the survey!');
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
