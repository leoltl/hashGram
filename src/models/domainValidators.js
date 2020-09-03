import { ClientError } from '../lib/errors';

function validNewUser(payload) {
  const {
    password,
    passwordConfirm,
    email,
    handle,
  } = payload;

  if (!password) {
    throw new ClientError({ message: 'Invalid password field.' });
  }

  if (!passwordConfirm) {
    throw new ClientError({ message: 'Missing password confirm' });
  }

  if (password !== passwordConfirm) {
    throw new ClientError({ message: 'Password and password confirm does not match' });
  }

  const emailRe = new RegExp(/\S+@\S+\.\S+/);
  if (!email || !emailRe.test(email)) {
    throw new ClientError({ message: 'Invalid email provided.' });
  }

  if (!handle) {
    throw new ClientError({ message: 'User handle is required.' });
  }

  return true;
}

export default {
  User: validNewUser,
};
