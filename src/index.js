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

import aws from 'aws-sdk';
const { S3_BUCKET } = process.env;
aws.config.region = 'us-west-2';

console.log(process.env);
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
app.use(makeLoadAuthUserFromSession(UserModel));

app.get('/new-post', (req, res) => {
  res.render('new_post');
});

app.get('/sign-s3', (req, res) => {
  const s3 = new aws.S3();
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const FOLDER = 'user-content';
  const s3Params = {
    Bucket: `${S3_BUCKET}/${FOLDER}`,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read',
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).end();
    }

    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${FOLDER}/${fileName}`,
    };
    res.json(returnData);
  });
});

installAuthControllers(router, UserModel);
installUserControllers(router, UserModel, PostModel);
installPostControllers(router, PostModel);

app.use(router);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
