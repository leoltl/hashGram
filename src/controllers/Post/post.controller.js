import { DOAError, ClientError } from '../../lib/errors';
import { authenticationRequired } from '../../middlewares/loadAuthUser';
import { makePostAggregatorService } from './aggregratePost.service';

export function makeGetAllPosts(getAllPostFromDB, aggregatePostsService) {
  return async function getAllPosts(req, res, next) {
    try {
      const userParams = res.locals.authUser ? { authUserId: res.locals.authUser.id } : undefined;
      const posts = await getAllPostFromDB(userParams);
      console.log(posts[0]);
      const aggregatedPosts = await aggregatePostsService.aggregrate(posts, res.locals.authUser);
      res.render('index', {
        posts: aggregatedPosts,
      });
    } catch (e) {
      console.log(e);
      next(e);
    }
  };
}

export function makeGetPost(getPostFromDB, aggregatePostsService) {
  return async function getPost(req, res, next) {
    try {
      const { imageUid } = req.params;
      const post = await getPostFromDB({ imageUid });
      const [aggreatedPost] = await aggregatePostsService.aggregrate(post, res.locals.authUser);
      res.render('post', {
        post: aggreatedPost,
        isStandAlone: true,
      });
    } catch (e) {
      console.log(e);
      next(e);
    }
  };
}

export function makeNewPost(createPostInDB) {
  return async function newPost(req, res, next) {
    /* TODO: add validation of missing imageUrl */
    const { caption, imageUid } = req.body;
    const { id: userId } = res.locals.authUser;
    await createPostInDB({
      caption, userId, imageUid,
    });
    res.redirect('/');
  };
}

export function newPostPage(req, res) {
  if (!res.locals.authUser) {
    return res.redirect('/signin');
  }
  res.render('new_post');
}

export function makeLikeDislikePost(likePostInDB, unlikePostInDB) {
  return async function likeDislikePost(req, res, next) {
    try {
      const { action } = req.query;
      const { id: user_id } = res.locals.authUser;
      const { postId: post_id } = req.body;
      if (action === 'like') {
        await likePostInDB({ user_id, post_id });
      } else if (action === 'unlike') {
        await unlikePostInDB({ user_id, post_id });
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

export function installPostControllers(router, postModel) {
  router.post('/new-post',
    authenticationRequired,
    makeNewPost(postModel.create));
  router.post('/api/like-post',
    authenticationRequired,
    makeLikeDislikePost(postModel.likePost, postModel.unlikePost));
  router.get('/new-post', newPostPage);
  return router;
}

export function installFeedController(router, postModel, commentModel) {
  const aggregatePostsService = makePostAggregatorService(commentModel.getAll, postModel.getLikes);
  router.get('/p/:imageUid', makeGetPost(postModel.get, aggregatePostsService));
  router.get('/', makeGetAllPosts(postModel.getAll, aggregatePostsService));
  return router;
}
