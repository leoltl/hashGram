import './env';
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import session from 'express-session';
import morgan from 'morgan';
import favicon from 'serve-favicon';
import connectRedis from 'connect-redis';
import messageQueue from './config/messageQueue';

import db from '../knex/knex';
import redisClient from './config/redis';
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

/* parse json and forms */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* express session with redis as storage */
const RedisStore = connectRedis(session);
const sessionParser = session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  cookie: {
    httpOnly: true,
  },
})
app.use(sessionParser);

/* serves static files */
app.use(favicon(path.join(__dirname, '..', 'public', 'favicon', 'favicon.ico')));
app.use('/stylesheets', express.static(path.join(__dirname, '..', 'public', 'stylesheets')));
app.use('/scripts', express.static(path.join(__dirname, '..', 'public', 'scripts')));

const UserModel = makeUser(db);
const PostModel = makePost(db);
const CommentModel = makeComment(db);
app.use(makeLoadAuthUserFromSession(UserModel));

installStorageRoute(router);
installAuthControllers(router, UserModel, messageQueue, redisClient);
installPostControllers(router, PostModel);
installFeedController(router, PostModel, CommentModel, UserModel);
installCommentControllers(router, CommentModel);

// user routes should be last to initialize
installUserControllers(router, UserModel, PostModel);

app.use(router);
app.use(errorHandler);


export default app;

export { sessionParser };