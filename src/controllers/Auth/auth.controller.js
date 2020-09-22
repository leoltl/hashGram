/* eslint-disable consistent-return */
import bcrypt from 'bcrypt';
import { DOAError, ClientError } from '../../lib/errors';
import domainValidators from '../../models/domainValidators';
import { trimFields, genEmailVerificationCode } from '../../lib/utils';
import { authenticationRequired } from '../../middlewares/loadAuthUser';
import makeEmailVerificationService from './emailVerification.service';

export function makeCreateUser(
    createUserInDB, hashFunction, throwOnInvalidUserField, emailVerificationService
  ) {
  return async function createUser(req, res, next) {
    const payload = req.body || {};
    try {
      throwOnInvalidUserField(payload);
      const { passwordConfirm, ...newUser } = payload; // exclude password confirm
      const sanitizedUser = trimFields(newUser);
      sanitizedUser.password = hashFunction(sanitizedUser.password);
      const [{ handle }] = await createUserInDB(sanitizedUser);
      
      // save user to session
      req.session.user_handle = handle;

      await emailVerificationService.sendVerificationCode(sanitizedUser.email, handle);
     
      res.redirect('/verify-email');
    } catch (e) {
      console.log(e)
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
    const sanitizedUser = trimFields(req.body);
    const { handle, password: plainPassword } = sanitizedUser;
    try {
      if (handle.trim() && plainPassword.trim()) {
        const user = await getUserFromDB(handle, { columns: ['handle', 'password'] });
        if (user && compareHash(plainPassword, user.password)) {
          req.session.user_handle = user.handle;
          return res.redirect('/');
        }
      }
      req.session.error_msg = 'Authentication failed. Please try again.';
      res.redirect('/signin');
    } catch (e) {
      next(e);
    }
  };
}

export function makeResendEmail(emailVerificationService) {
  return async function resendEmail(req, res, next) {
    try {
      if (res.locals.authUser.active) {
        return res.redirect('/');
      }
      const { email, handle } = res.locals.authUser;
      await emailVerificationService.sendVerificationCode(email, handle);
      res.redirect('/verify-email');
    } catch (e) {
      next(e);
    }
  }
}

export function makeVerifyUserEmail(updateUserInDB, emailVerificationService) {
  return async function verifyEmail(req, res, next) {
    try {
      const { code } = req.body;
      const { handle } = res.locals.authUser;

      const success = await emailVerificationService.verify(handle, code);

      if (success) {
        await updateUserInDB({ active: true, handle })
        return res.redirect('/');
      }
      
      // TODO
      // return to previous page and show error message code not match.
      res.locals.error_msg = 'Verification code is incorrect.'
      res.render('verify-email');
    } catch (e) {
      next(e)
    }
  }
}

export function verifiyEmailPage(req, res) {
  if (res.locals.authUser.active) {
    return res.redirect('/');
  }
  res.render('verify-email');
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

export function signout(req, res) {
  req.session.user_handle = null;
  res.redirect('/');
}

export default function installAuthControllers(router, userModel, messageQueue, redisClient) {
  const emailVerificationService = makeEmailVerificationService(
    messageQueue.publish,
    genEmailVerificationCode,
    (key, value) => redisClient.setex(key, 15 * 60, value),
    redisClient.get.bind(redisClient),
  )
  
  const createUser = makeCreateUser(
    userModel.create,
    (password) => bcrypt.hashSync(password, 10),
    domainValidators.User,
    emailVerificationService,
  );

  const signinUser = makeSigninUser(
    userModel.get,
    bcrypt.compareSync,
  );

  const verifyEmail = makeVerifyUserEmail(
    userModel.update,
    emailVerificationService,
  )
 
  const resendEmail = makeResendEmail(emailVerificationService);

  router.get('/signin', signinPage);
  router.post('/signin', signinUser);

  router.get('/signup', signupPage);
  router.post('/signup', createUser);

  router.get('/verify-email', authenticationRequired, verifiyEmailPage);
  router.post('/verify-email', authenticationRequired, verifyEmail);

  router.get('/resend-verify-email', authenticationRequired, resendEmail);

  router.get('/signout', signout);

  return router;
}
