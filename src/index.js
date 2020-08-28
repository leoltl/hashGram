import './env';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('welcome to hashGram');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
