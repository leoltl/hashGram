function makeComment(db, baseModel) {
  const DEFAULT_GET_COLUMNS = ['comments.id', 'body', 'comments.created_at', 'comments.post_id', 'users.handle'];

  function getAll(queryObject, options = {}) {
    const returnColumns = options.columns || DEFAULT_GET_COLUMNS;
    const query = db('comments')
      .select(returnColumns)
      .join('users', 'comments.user_id', 'users.id');

    if (typeof queryObject === 'number' || typeof queryObject === 'string') {
      return baseModel.safeQuery(query, { post_id: queryObject });
    }

    if (Array.isArray(queryObject)) {
      return baseModel.safeQuery(query.whereIn('comments.post_id', queryObject));
    }

    return baseModel.safeQuery(query, queryObject);
  }

  function get(queryObject, options = {}) {
    const returnColumns = options.columns || DEFAULT_GET_COLUMNS;
    const query = db('comments')
      .select(returnColumns)
      .join('users', 'comments.user_id', 'users.id');

    if (typeof queryObject === 'number' || typeof queryObject === 'string') {
      return baseModel.safeQuery(query, { id: queryObject });
    }

    return baseModel.safeQuery(query, queryObject);
  }

  async function create(dataObject, options = {}) {
    const returnColumns = options.columns || ['*'];
    const res = await baseModel.safeInsert(db('comments').returning(returnColumns), dataObject);

    if (process.env.NODE_ENV === 'test') {
      // workaround sqlite3 driver does not return fields for inserted row
      return this.get({ id: res[0] }, { columns: returnColumns });
    }

    return Promise.resolve(res);
  }

  return {
    get,
    getAll,
    create,
  };
}

export default makeComment;
