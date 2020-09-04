import { DOAError, ClientError } from '../../lib/errors';
import { authenticationRequired } from '../../middlewares/loadAuthUser';

export function makeGetUserProfile(UserModel, PostModel) {
  return async function getUserProfile(req, res, next) {
    const { handle = {} } = req.params;
    try {
      const [user] = await UserModel.get(handle);
      const posts = await PostModel.getAll(handle);
      const { count: followersCount } = await UserModel.getFollower(handle, { aggregration: 'count' });
      const { count: followingCount } = await UserModel.getFollowing(handle, { aggregration: 'count' });
      res.render('profile', {
        posts,
        user: { ...user, followersCount, followingCount },
      });
    } catch (e) {
      next(e);
    }
  };
}

export function makeFollowUser(UserModel) {
  return async function followUser(req, res, next) {
    try {
      const { handle: userhandle } = res.locals.authUser;
      const { followerhandle } = req.body;
      await UserModel.addFollower({ userhandle, followerhandle });
      res.status(200).end();
    } catch (e) {
      if (e instanceof DOAError) {
        next(new ClientError({ message: e.message }));
      }
      next(e);
    }
  };
}

export default function installUserControllers(router, UserModel, PostModel) {
  router.get('/:handle', makeGetUserProfile(UserModel, PostModel));
  router.post('/api/follow', authenticationRequired, makeFollowUser(UserModel));
  return router;
}
