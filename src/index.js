import './env';
import express from 'express';
import path from 'path';

const PORT = process.env.PORT || 3000;

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'templates'));

app.get('/', async (req, res) => {
  res.render('test');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
