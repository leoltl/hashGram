export function makeGetAllPosts(getAllPostFromDB) {
  return async function getAllPosts(req, res) {
    const posts = await getAllPostFromDB();
    res.render('index', {
      posts,
    });
  };
}

export default function installPostControllers(router, postModel) {
  router.get('/', makeGetAllPosts(postModel.getAll));
  return router;
}
