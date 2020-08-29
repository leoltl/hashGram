import './env';
import express from 'express';
import db from './database/database';

const PORT = process.env.PORT || 3000;

const app = express();

app.get('/', async (req, res) => {
  const u = await db.select('id').from('users');
  res.send(`welcome to hashGram ${JSON.stringify(u)}`);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
