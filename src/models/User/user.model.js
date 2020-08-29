function makeUser(db, baseModel) {
  const DEFAULT_GET_COLUMNS = ['users.id', 'email', 'first_name', 'last_name'];

  async function getAll(options = {}) {
    const returnColumns = options.columns || DEFAULT_GET_COLUMNS;
    return baseModel.safeQuery(db('users').select(returnColumns));
  }

  async function get(queryObject, options = {}) {
    const returnColumns = options.columns || DEFAULT_GET_COLUMNS;
    return baseModel.safeQuery(db('users').select(returnColumns), queryObject);
  }

  async function create(dataObject, options = {}) {
    const returnColumns = options.columns || DEFAULT_GET_COLUMNS;
    const res = await baseModel.safeInsert(db('users').returning(returnColumns), dataObject);
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

export default makeUser;
