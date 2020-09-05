/* eslint-disable consistent-return */
import { AuthenticationError } from "../lib/errors";

export default function makeLoadAuthUser(userModel) {
  return async function loadAuthUser(req, res, next) {
    try {
      if (req.session.user_handle) {
        const user = await userModel.get(req.session.user_handle);
        res.locals.authUser = user;
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
