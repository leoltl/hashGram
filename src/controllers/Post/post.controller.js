import { DOAError, ClientError } from '../../lib/errors';
import { authenticationRequired } from '../../middlewares/loadAuthUser';
import { makePostAggregatorService } from './aggregratePost.service';

export function makeGetAllPosts(getAllPostFromDB, aggregatePostsService, getSuggestedUsersFromDB) {
  return async function getAllPosts(req, res, next) {
    let suggestedUsers = [];
    try {
      const userParams = res.locals.authUser ? { authUserId: res.locals.authUser.id } : undefined;
      const posts = await getAllPostFromDB(userParams);
      const aggregatedPosts = await aggregatePostsService.aggregrate(posts, res.locals.authUser);
      if (posts.length === 0) {
        // if res.locals.authUser not exists, then posts.length will never be 0
        suggestedUsers = await getSuggestedUsersFromDB(res.locals.authUser.id);
      }
      res.render('index', {
        posts: aggregatedPosts,
        suggestions: suggestedUsers,
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

export function makeNewPost(createPostInDB, publishToMessageQueue) {
  return async function newPost(req, res, next) {
    try {
      const { caption, imageUid, blur } = req.body;
    
      if (!imageUid || blur < 0 || blur >= 15) {
        // invalid input
        return res.redirect('/new-post')
      }

      const { id: userId } = res.locals.authUser;
      const imageProcessingConfig = {
        resource_key: imageUid,
        filters: []
      }
      if (blur !== 0) { imageProcessingConfig.filters.push(['blur', parseInt(blur, 10)])}
      await createPostInDB({
        caption, userId, imageUid,
      });
      await publishToMessageQueue("upload", imageProcessingConfig)
      res.redirect(`/p/${imageUid}`);
    } catch (e) {
      next(e)
    }
    
  };
}

export function newPostPage(req, res) {
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

function makeActivityPage(getLikedPostsFromDB) {
  return async function activityPage(req, res) {
    let posts = [];
    if (res.locals.authUser) {
      posts = await getLikedPostsFromDB(res.locals.authUser.id);
    }
    res.render('activity', {
      posts,
    });
  };
}

export function installPostControllers(router, postModel, messageQueue) {
  router.post('/new-post',
    authenticationRequired,
    makeNewPost(postModel.create, messageQueue.publish));
  router.post('/api/like-post',
    authenticationRequired,
    makeLikeDislikePost(postModel.likePost, postModel.unlikePost),
    );
  router.get('/new-post', newPostPage);
  router.get('/activity', makeActivityPage(postModel.getLikedPosts));
  return router;
}

export function installFeedController(router, postModel, commentModel, userModel) {
  const aggregatePostsService = makePostAggregatorService(commentModel.getAll, postModel.getLikes);
  router.get('/p/:imageUid', makeGetPost(postModel.get, aggregatePostsService));
  router.get('/', makeGetAllPosts(postModel.getAll, aggregatePostsService, userModel.notFollowing));
  return router;
}
