import './env';
import express from 'express';
import path from 'path';

import makeUser from './models/User/user.model';
import db from '../knex/knex';

const User = makeUser(db);

const PORT = process.env.PORT || 3000;

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'templates'));

app.get('/', async (req, res) => {
  const users = await User.getAll();
  res.render('test', {
    name: JSON.stringify(users),
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
