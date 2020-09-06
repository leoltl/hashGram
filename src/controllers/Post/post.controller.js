import { authenticationRequired } from '../../middlewares/loadAuthUser';

export function makeGetAllPosts(getAllPostFromDB) {
  return async function getAllPosts(req, res, next) {
    try {
      const posts = await getAllPostFromDB(res.locals.authUser?.id);
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

export function installFeedController(router, postModel) {
  router.get('/', makeGetAllPosts(postModel.getFeed));
  return router;
}
