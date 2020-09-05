function makePost(db, baseModel) {
  const DEFAULT_GET_COLUMNS = ['posts.id', 'image_url', 'caption', 'users.handle', 'users.full_name'];

  function getAll(queryObject = {}, options = {}) {
    const returnColumns = options.columns || DEFAULT_GET_COLUMNS;
    const query = db('posts').select(returnColumns).join('users', 'posts.user_id', 'users.id');
    if (typeof queryObject === 'string') {
      return baseModel.safeQuery(query, { handle: queryObject });
    }
    return baseModel.safeQuery(query, queryObject);
  }

  function get(queryObject, options = {}) {
    const returnColumns = options.columns || DEFAULT_GET_COLUMNS;
    const query = db('posts').select(returnColumns).join('users', 'posts.user_id', 'users.id');
    return baseModel.safeQuery(query, queryObject);
  }

  async function create(dataObject, options = {}) {
    const returnColumns = options.columns || ['posts.id', 'image_url', 'caption'];
    const res = await baseModel.safeInsert(db('posts').returning(returnColumns), dataObject);
    if (process.env.NODE_ENV === 'test') {
      // workaround sqlite3 driver does not return fields for inserted row
      return this.get({ id: res[0] }, { columns: returnColumns });
    }
    return Promise.resolve(res);
  }

  return {
    getAll,
    get,
    create,
  };
}

export default makePost;
