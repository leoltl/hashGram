import './env';
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import session from 'express-session';
import morgan from 'morgan';

import db from '../knex/knex';
import { errorHandler, makeLoadAuthUserFromSession } from './middlewares';
import { makeUser, makePost } from './models';
import { installAuthControllers, installUserControllers, installPostControllers } from './controllers';

const PORT = process.env.PORT || 3000;

const app = express();
const router = express.Router();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'templates'));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev', {
    skip(req) {
      return req.path.match(/(png|svg|jpeg|woff2|css|js|)$/ig)[0];
    },
  }));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: {
    httpOnly: false,
  },
}));
app.use('/stylesheets', express.static(path.join(__dirname, '..', 'public', 'stylesheets')));

const UserModel = makeUser(db);
const PostModel = makePost(db);
app.use(makeLoadAuthUserFromSession(UserModel));

installAuthControllers(router, UserModel);
installUserControllers(router, UserModel, PostModel);
installPostControllers(router, PostModel);

app.use(router);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
