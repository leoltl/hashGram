/* eslint-disable consistent-return */
import bcrypt from 'bcrypt';
import { DOAError, ClientError } from '../../lib/errors';
import domainValidators from '../../models/domainValidators';

function makeSignupRoutes(createUserInDB, hashFunction, validNewUser) {
  async function createUser(req, res, next) {
    const { payload } = req.body;
    try {
      if (validNewUser(payload)) {
        /* exclude password confirm for new user creation */
        const { passwordConfirm, ...newUser } = payload;
        newUser.password = hashFunction(newUser.password);
        const [handle] = await createUserInDB(newUser);
        req.session.user_handle = handle;
        res.redirect('/');
      }
    } catch (e) {
      if (e instanceof DOAError) {
        return next(new ClientError({ message: e.message }));
      }
      next(e);
    }
  }

  function signupPage(req, res) {
    if (res.locals.authUser) {
      res.redirect('/');
    }
    res.render('signup');
  }

  return function installRoutes(router) {
    /* hooking up controllers to router */
    router.get('/signup', signupPage);
    router.post('/signup', createUser);
  };
}

function makeSigninRoutes(getUserFromDB, compareHash) {
  async function signInUser(req, res, next) {
    const { payload: { handle, password: plainPassword } } = req.body;
    try {
      const [user] = await getUserFromDB(handle, { columns: ['handle', 'password'] });
      if (handle === user.handle && compareHash(plainPassword, user.password)) {
        req.session.user_handle = user.handle;
        return res.redirect('/');
      }
      res.redirect('/signin');
    } catch (e) {
      next(e);
    }
  }

  function signinPage(req, res) {
    if (res.locals.authUser) {
      res.redirect('/');
    }
    res.render('signin');
  }

  return function installRoutes(router) {
    /* hooking up controllers to router */
    router.post('/signin', signInUser);
    router.get('/signin', signinPage);
  };
}

export default function installAuthControllers(router, userModel) {
  makeSignupRoutes(
    userModel.create,
    (password) => bcrypt.hashSync(password, 10),
    domainValidators.User,
  )(router);
  makeSigninRoutes(
    router,
    userModel.get,
    bcrypt.compareSync,
  )(router);
  return router;
}
