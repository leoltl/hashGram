import { DOAError, ClientError } from '../../lib/errors';
import { authenticationRequired } from '../../middlewares/loadAuthUser';
import { mapItemToKey } from '../../lib/utils';

export function makeGetAllPosts(getAllPostFromDB, getAllCommentsFromDB, getLikesFromDB) {
  return async function getAllPosts(req, res, next) {
    try {
      const posts = await getAllPostFromDB(res.locals.authUser
         && { authUserId: res.locals.authUser.id });
      if (posts.length) {
        const resultMap = new Map(); // use map to preserve posts order
        mapItemToKey(resultMap.set.bind(resultMap), posts, (p) => p.postId);
        const postIds = Array.from(resultMap.keys());

        const [comments, likes] = await Promise.all([
          getAllCommentsFromDB(postIds), getLikesFromDB(postIds),
        ]);
        comments.forEach((comment) => {
          // comments is added in reference to original post objects
          const post = resultMap.get(comment.postId);
          post.comments = post.comments || [];
          post.comments.push(comment);
        });

        likes.forEach((like) => {
          const post = resultMap.get(like.postId);
          post.likes = post.likes || [];
          post.likes.push(like);
          if (res.locals.authUser && like.handle === res.locals.authUser.handle) {
            post.liked = true;
          }
        });
      }
      res.render('index', {
        posts,
      });
    } catch (e) {
      console.log(e);
      next(e);
    }
  };
}

export function makeGetPost(getPostFromDB, getAllCommentsFromDB, getLikesFromDB) {
  return async function getPost(req, res, next) {
    try {
      const { imageUid } = req.params;
      const post = await getPostFromDB({ imageUid });
      const comments = await getAllCommentsFromDB({ post_id: post.postId });
      const likes = await getLikesFromDB(post.postId);
      comments.forEach((comment) => {
        post.comments = post.comments || [];
        post.comments.push(comment);
      });
      likes.forEach((like) => {
        post.likes = post.likes || [];
        post.likes.push(like);
        if (res.locals.authUser && like.handle === res.locals.authUser.handle) {
          post.liked = true;
        }
      });
      res.render('post', {
        post,
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
      console.log(e)
      if (e instanceof DOAError) {
        next(new ClientError({ message: e.message }));
      }
      next(e);
    }
  };
}

export function installPostControllers(router, postModel) {
  router.post('/new-post', authenticationRequired, makeNewPost(postModel.create));
  router.post('/api/like-post', authenticationRequired, makeLikeDislikePost(postModel.likePost, postModel.unlikePost));
  router.get('/new-post', newPostPage);
  return router;
}

export function installFeedController(router, postModel, commentModel) {
  router.get('/p/:imageUid', makeGetPost(postModel.get, commentModel.getAll, postModel.getLikes));
  router.get('/', makeGetAllPosts(postModel.getAll, commentModel.getAll, postModel.getLikes));
  return router;
}
