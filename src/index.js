import './env';
import express from 'express';
import path from 'path';

import { makeUser, makePost } from './models';
import db from '../knex/knex';

const User = makeUser(db);
const Post = makePost(db);

const PORT = process.env.PORT || 3000;

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'templates'));

app.use('/stylesheets', express.static(path.join(__dirname, '..', 'public', 'stylesheets')));

app.get('/:handle?', async (req, res) => {
  const { handle = {} } = req.params;
  const posts = await Post.getAll(handle);
  res.render('profile', {
    posts,
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
