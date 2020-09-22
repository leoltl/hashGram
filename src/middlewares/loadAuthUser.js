/* eslint-disable consistent-return */
import { AuthenticationError } from "../lib/errors";

export default function makeLoadAuthUser(userModel) {
  return async function loadAuthUser(req, res, next) {
    try {
      if (req.session.user_handle) {
        const user = await userModel.get(req.session.user_handle, { columns: ['users.id', 'email', 'full_name', 'handle', 'avatar', 'bio', 'active'] });
        res.locals.authUser = user;
        if (user.active === false) {
          res.locals.error_msg = ' <a href="/verify-email">Please click here to verify your email</a>'
        }
        console.log(user.active)
      }
    } catch (e) {
      console.log(e);
    } finally {
      next();
    }
  };
}

export function authenticationRequired(req, res, next) {
  if (!res.locals.authUser) {
    return next(new AuthenticationError({ message: 'Authentication Error. Please sign in to access this resource' }));
  }
  next();
}
