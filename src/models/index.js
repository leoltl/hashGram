import baseModel from './model';
import makeuser from './User/user.model';

export function makeUser(db) {
  return makeuser(db, baseModel);
}

export default {
  makeUser,
};
