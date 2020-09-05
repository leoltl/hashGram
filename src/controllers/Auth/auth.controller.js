/* eslint-disable consistent-return */
import bcrypt from 'bcrypt';
import { DOAError, ClientError } from '../../lib/errors';
import domainValidators from '../../models/domainValidators';

export function makeCreateUser(createUserInDB, hashFunction, throwOnInvalidUserField) {
  return async function createUser(req, res, next) {
    const payload = req.body || {};
    try {
      throwOnInvalidUserField(payload);
      const { passwordConfirm, ...newUser } = payload; // exclude password confirm
      newUser.password = hashFunction(newUser.password);
      const [handle] = await createUserInDB(newUser);
      req.session.user_handle = handle;
      res.redirect('/');
    } catch (e) {
      if (e instanceof ClientError || e instanceof DOAError) {
        req.session.error_msg = e.message;
        req.session.prevFilled = payload;
        return res.redirect('/signup');
      }
      next(e);
    }
  };
}

export function makeSigninUser(getUserFromDB, compareHash) {
  return async function signInUser(req, res, next) {
    if (res.locals.authUser) {
      return res.redirect('/');
    }
    const { handle, password: plainPassword } = req.body;
    try {
      const user = await getUserFromDB(handle, { columns: ['handle', 'password'] });
      if (user && compareHash(plainPassword, user.password)) {
        req.session.user_handle = user.handle;
        return res.redirect('/');
      }
      req.session.error_msg = 'Authentication failed. Please try again.';
      res.redirect('/signin');
    } catch (e) {
      next(e);
    }
  };
}

export function signinPage(req, res) {
  if (res.locals.authUser) {
    return res.redirect('/');
  }
  if (req.session.error_msg) {
    res.locals.error_msg = req.session.error_msg;
    req.session.error_msg = null;
  }
  res.render('signin');
}

export function signupPage(req, res) {
  if (res.locals.authUser) {
    res.redirect('/');
  }
  if (req.session.error_msg) {
    res.locals.error_msg = req.session.error_msg;
    req.session.error_msg = null;
  }
  if (req.session.prevFilled) {
    res.locals.prevFilled = req.session.prevFilled;
    req.session.prevFilled = null;
  }
  res.render('signup');
}

export default function installAuthControllers(router, userModel) {
  const createUser = makeCreateUser(
    userModel.create,
    (password) => bcrypt.hashSync(password, 10),
    domainValidators.User,
  );
  const signinUser = makeSigninUser(
    userModel.get,
    bcrypt.compareSync,
  );

  router.get('/signin', signinPage);
  router.post('/signin', signinUser);

  router.get('/signup', signupPage);
  router.post('/signup', createUser);

  return router;
}