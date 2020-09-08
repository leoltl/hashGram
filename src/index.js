import './env';
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import session from 'express-session';
import morgan from 'morgan';

import db from '../knex/knex';
import { errorHandler, makeLoadAuthUserFromSession } from './middlewares';
import { makeUser, makePost, makeComment } from './models';
import {
  installAuthControllers,
  installUserControllers,
  installPostControllers,
  installFeedController,
  installCommentControllers,
  installStorageRoute,
} from './controllers';

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
app.use('/scripts', express.static(path.join(__dirname, '..', 'public', 'scripts')));

const UserModel = makeUser(db);
const PostModel = makePost(db);
const CommentModel = makeComment(db);
app.use(makeLoadAuthUserFromSession(UserModel));

installStorageRoute(router);
installAuthControllers(router, UserModel);
installPostControllers(router, PostModel);
installFeedController(router, PostModel, CommentModel, UserModel);
installCommentControllers(router, CommentModel);

// user routes should be last to initialize
installUserControllers(router, UserModel, PostModel);

app.use(router);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
