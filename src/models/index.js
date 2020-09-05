import baseModel from './model';
import makeuser from './User/user.model';
import makepost from './Post/post.model';
import makecomment from './Comment/comment.model';

export function makeUser(db) {
  return makeuser(db, baseModel);
}

export function makePost(db) {
  return makepost(db, baseModel);
}

export function makeComment(db) {
  return makecomment(db, baseModel);
}

export default {
  makeUser,
  makePost,
  makeComment,
};
