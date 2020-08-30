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

  async function create(dataObject, options = {}) {
    const returnColumns = options.columns || DEFAULT_GET_COLUMNS;
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
