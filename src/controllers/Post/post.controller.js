export function makeGetAllPosts(PostModel) {
  return async function getAllPosts(req, res) {
    const posts = await PostModel.getAll();
    res.render('index', {
      posts,
    });
  };
}

export default function installPostControllers(router, postModel) {
  router.get('/', makeGetAllPosts(postModel));
  return router;
}
