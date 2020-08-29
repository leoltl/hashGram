function makeUser(db, baseModel) {
  const DEFAULT_GET_COLUMNS = ['id', 'email', 'first_name', 'last_name'];

  async function getAll(options = {}) {
    const returnColumns = options.columns || DEFAULT_GET_COLUMNS;
    return baseModel.safeQuery(db('users').select(returnColumns));
  }

  async function get(queryObject, options = {}) {
    const returnColumns = options.columns || DEFAULT_GET_COLUMNS;
    return baseModel.safeQuery(db('users').select(returnColumns).where(queryObject));
  }

  async function create(dataObject, options = {}) {
    const returnColumns = options.columns || DEFAULT_GET_COLUMNS;
    const data = baseModel.makeDOASnakeCase(dataObject);
    const res = await baseModel.safeInsert(db('users').returning(returnColumns).insert(data));
    if (process.env.NODE_ENV === 'test') {
      // get around sqlite3 driver does not return fields for inserted row
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
