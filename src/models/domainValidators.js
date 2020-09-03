import { ClientError } from '../lib/errors';

function validNewUser(payload) {
  if (!payload.handle) {
    throw new ClientError({ message: 'User handle is required.' });
  }

  if (!payload.password) {
    throw new ClientError({ message: 'Missing password field.' });
  }

  if (!payload.passwordConfirm) {
    throw new ClientError({ message: 'Missing password confirm.' });
  }

  if (!payload.email) {
    throw new ClientError({ message: 'Email is required.' });
  }

  if (payload.password !== payload.passwordConfirm) {
    throw new ClientError({ message: 'Password and password confirm does not match' });
  }

  const emailRe = new RegExp(/\S+@\S+\.\S+/);
  if (!emailRe.test(payload.email)) {
    throw new ClientError({ message: 'Invalid email provided.' });
  }
}

export default {
  User: validNewUser,
};
