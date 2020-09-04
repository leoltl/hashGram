import { ClientError } from '../../lib/errors';

function makeUser(db, baseModel) {
  const DEFAULT_GET_COLUMNS = ['users.id', 'email', 'full_name', 'handle'];

  async function getAll(options = {}) {
    const returnColumns = options.columns || DEFAULT_GET_COLUMNS;
    return baseModel.safeQuery(db('users').select(returnColumns));
  }

  async function get(queryObject, options = {}) {
    const returnColumns = options.columns || DEFAULT_GET_COLUMNS;
    const query = db('users').select(returnColumns).first();
    if (typeof queryObject === 'string') {
      return baseModel.safeQuery(query, { handle: queryObject });
    }
    return baseModel.safeQuery(query, queryObject);
  }

  async function create(dataObject, options = {}) {
    const returnColumns = options.columns || ['handle'];
    const res = await baseModel.safeInsert(db('users').returning(returnColumns), dataObject);
    if (process.env.NODE_ENV === 'test') {
      // workaround sqlite3 driver does not return fields for inserted row
      return this.get({ id: res[0] }, { columns: returnColumns });
    }
    return Promise.resolve(res);
  }

  async function getFollowing(dataObject, options = {}) {
    const returnColumns = options.columns || ['follower.handle'];
    const query = options.aggregration === 'count'
      ? db('following')
        .join('users as u', 'following.user_id', 'u.id')
        .join('users as follower', 'following.follower_id', 'follower.id')
        .count({ count: '*' })
        .first()
      : db('following')
        .join('users as u', 'following.user_id', 'u.id')
        .join('users as follower', 'following.follower_id', 'follower.id')
        .select(returnColumns);
    if (typeof dataObject === 'string') {
      return baseModel.safeQuery(query, { 'follower.handle': dataObject });
    }
    return baseModel.safeQuery(query, dataObject);
  }

  async function getFollower(dataObject, options = {}) {
    const returnColumns = options.columns || ['follower.handle'];
    const query = options.aggregration === 'count'
      ? db('following')
        .join('users as u', 'following.user_id', 'u.id')
        .join('users as follower', 'following.follower_id', 'follower.id')
        .count({ count: '*' })
        .first()
      : db('following')
        .join('users as u', 'following.user_id', 'u.id')
        .join('users as follower', 'following.follower_id', 'follower.id')
        .select(returnColumns);
    if (typeof dataObject === 'string') {
      return baseModel.safeQuery(query, { 'u.handle': dataObject });
    }
    return baseModel.safeQuery(query, dataObject);
  }

  async function addFollower(dataObject) {
    const { userhandle, followerhandle } = dataObject;
    if (!userhandle || !followerhandle) {
      throw new ClientError({ message: 'User and follwer handles are required.' });
    }
    return baseModel.safeInsert(db('following').insert({
      user_id() {
        this.select('id').from('users').where('handle', userhandle);
      },
      follower_id() {
        this.select('id').from('users').where('handle', followerhandle);
      },
    }));
  }

  return {
    getAll,
    get,
    create,
    getFollower,
    addFollower,
    getFollowing,
  };
}

export default makeUser;
