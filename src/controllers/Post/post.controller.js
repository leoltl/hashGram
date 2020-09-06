import { authenticationRequired } from '../../middlewares/loadAuthUser';
import { mapItemToKey } from '../../lib/utils';

export function makeGetAllPosts(getAllPostFromDB, getAllCommentsFromDB) {
  return async function getAllPosts(req, res, next) {
    try {
      const posts = await getAllPostFromDB(res.locals.authUser
         && { authUserId: res.locals.authUser.id });
      if (posts.length) {
        const resultMap = new Map(); // use map to preserve posts order
        mapItemToKey(resultMap.set.bind(resultMap), posts, (p) => p.postId);
        const postIds = Array.from(resultMap.keys());
        const comments = await getAllCommentsFromDB(postIds);
        comments.forEach((comment) => {
          // comments is added in reference to original post objects
          const post = resultMap.get(comment.postId);
          post.comments = post.comments || [];
          post.comments.push(comment);
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

export function makeGetPost(getPostFromDB, getAllCommentsFromDB) {
  return async function getPost(req, res, next) {
    const { imageUid } = req.params;
    const post = await getPostFromDB({ imageUid });
    const comments = await getAllCommentsFromDB({ post_id: post.postId });
    comments.forEach((comment) => {
      post.comments = post.comments || [];
      post.comments.push(comment);
    });
    res.render('post', {
      post,
      isStandAlone: true,
    });
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

export function installPostControllers(router, postModel) {
  router.post('/new-post', authenticationRequired, makeNewPost(postModel.create));
  router.get('/new-post', newPostPage);
  return router;
}

export function installFeedController(router, postModel, commentModel) {
  router.get('/', makeGetAllPosts(postModel.getAll, commentModel.getAll));
  router.get('/p/:imageUid', makeGetPost(postModel.get, commentModel.get));
  return router;
}
