import { DOAError, ClientError, HTTPError } from '../../lib/errors';
import { authenticationRequired } from '../../middlewares/loadAuthUser';

export function makeGetUserProfile(getUserInDB, getAllPostInDB, getFollowerInDB, getFollowingInDB) {
  return async function getUserProfile(req, res, next) {
    const { handle = {} } = req.params;
    try {
      const user = await getUserInDB(handle);
      if (!user) {
        throw new ClientError({ message: 'Profile you are finding does not exists.' });
      }
      const posts = await getAllPostInDB(handle);
      const postsCount = posts.length;
      const { count: followersCount } = await getFollowerInDB(handle, { aggregration: 'count' });
      const { count: followingCount } = await getFollowingInDB(handle, { aggregration: 'count' });
      res.render('profile', {
        posts,
        user: {
          ...user, followersCount, followingCount, postsCount,
        },
      });
    } catch (e) {
      if (e instanceof HTTPError) {
        res.render('error', {
          error: e.message,
        });
        return;
      }
      next(e);
    }
  };
}

export function makeFollowUser(addFollowerInDB) {
  return async function followUser(req, res, next) {
    try {
      const { handle: followerhandle } = res.locals.authUser;
      const { userhandle } = req.body;
      await addFollowerInDB({ userhandle, followerhandle });
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
  router.get('/:handle', makeGetUserProfile(
    UserModel.get,
    PostModel.getAll,
    UserModel.getFollower,
    UserModel.getFollowing,
  ));
  router.post('/api/follow', authenticationRequired, makeFollowUser(UserModel.addFollower));
  return router;
}
