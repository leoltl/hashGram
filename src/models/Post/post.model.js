function makePost(db, baseModel) {
  const DEFAULT_GET_COLUMNS = ['posts.id', 'user_id', 'image_url', 'caption'];

  function getAll(options = {}) {
    const returnColumns = options.columns || DEFAULT_GET_COLUMNS;
    return baseModel.safeQuery(db('posts').select(returnColumns));
  }

  async function get(queryObject, options = {}) {
    const returnColumns = options.columns || DEFAULT_GET_COLUMNS;
    const join = Object.keys(queryObject).some((key) => key.includes('.'));
    const query = join
      ? db('posts').select(returnColumns).join('users', 'posts.user_id', 'users.id')
      : db('posts').select(returnColumns);
    return baseModel.safeQuery(query, queryObject);
  }

  return {
    getAll,
    get,
  };
}

export default makePost;
