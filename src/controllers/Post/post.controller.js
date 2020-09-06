import { authenticationRequired } from '../../middlewares/loadAuthUser';

export function makeGetAllPosts(getAllPostFromDB, getAllCommentsFromDB) {
  return async function getAllPosts(req, res, next) {
    try {
      const posts = await getAllPostFromDB(res.locals.authUser
         && { authUserId: res.locals.authUser.id });

      if (posts.length !== 0) {
        const resultMap = new Map(); // use map to preserve posts order
        posts.forEach((post) => resultMap.set(post.postId, post));
        const comments = await getAllCommentsFromDB(Array.from(resultMap.keys()));
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

export function makeNewPost(createPostInDB) {
  return async function newPost(req, res, next) {
    /* TODO: add validation of missing imageUrl */
    const { imageUrl, caption } = req.body;
    const { id: userId } = res.locals.authUser;
    await createPostInDB({ imageUrl, caption, userId });
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
  return router;
}
