import { DOAError, ClientError, HTTPError } from '../../lib/errors';
import { authenticationRequired } from '../../middlewares/loadAuthUser';

export function makeGetUserProfile(
  getUserInDB,
  getAllPostInDB,
  getFollowerInDB,
  getFollowingInDB,
  isFollowingInDB,
) {
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
      let isFollowing = false;
      if (res.locals.authUser) {
        isFollowing = await isFollowingInDB(handle, res.locals.authUser.handle);
      }
      res.render('profile', {
        posts,
        user: {
          ...user, followersCount, followingCount, postsCount, isFollowing,
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

export function makeFollowUser(addFollowerInDB, removeFollowerInDB) {
  return async function followUser(req, res, next) {
    try {
      const { action } = req.query;
      const { handle: followerhandle } = res.locals.authUser;
      const { userhandle } = req.body;
      if (action === 'follow') {
        await addFollowerInDB({ userhandle, followerhandle });
      } else if (action === 'unfollow') {
        await removeFollowerInDB({ userhandle, followerhandle });
      }
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
    UserModel.isFollowing,
  ));
  router.post('/api/follow', authenticationRequired, makeFollowUser(
    UserModel.addFollower,
    UserModel.removeFollower,
  ));
  return router;
}
