import { authenticationRequired } from '../../middlewares/loadAuthUser';

export function makeNewComment(createCommentInDB) {
  return async function newComment(req, res, next) {
    const { postId, body } = req.body;
    const { id: userId } = res.locals.authUser;
    try {
      await createCommentInDB({ userId, postId, body });
      res.status(200).end();
    } catch (e) {
      console.log(e);
      next(e);
    }
  };
}

export default function installCommentController(router, commentModel) {
  router.post('/api/new-comment', authenticationRequired, makeNewComment(commentModel.create));
  return router;
}
