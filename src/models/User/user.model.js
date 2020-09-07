import uniqueString from 'unique-string';
import { ClientError } from '../../lib/errors';

function makeUser(db, baseModel) {
  const DEFAULT_GET_COLUMNS = ['users.id', 'email', 'full_name', 'handle', 'avatar', 'bio'];

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
    const avatar = uniqueString();
    const res = await baseModel.safeInsert(db('users').returning(returnColumns), { ...dataObject, avatar });
    if (process.env.NODE_ENV === 'test') {
      // workaround sqlite3 driver does not return fields for inserted row
      return this.get({ id: res[0] }, { columns: returnColumns });
    }
    return Promise.resolve(res);
  }

  async function update(dataObject) {
    const { id, ...rest } = dataObject; // exclude id update
    const query = db('users').where({ handle: dataObject.handle });
    return baseModel.safeUpdate(query, rest);
  }

  async function getFollowing(dataObject, options = {}) {
    const returnColumns = options.columns || ['follower.handle'];
    const query = options.aggregration === 'count'
      ? db('following')
        .join('users as u', 'following.user_id', 'u.id')
        .join('users as follower', 'following.follower_id', 'follower.id')
        .andWhere({ is_active: true })
        .count({ count: '*' })
        .first()
      : db('following')
        .join('users as u', 'following.user_id', 'u.id')
        .join('users as follower', 'following.follower_id', 'follower.id')
        .select(returnColumns)
        .andWhere({ is_active: true });
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
        .andWhere({ is_active: true })
        .first()
      : db('following')
        .join('users as u', 'following.user_id', 'u.id')
        .join('users as follower', 'following.follower_id', 'follower.id')
        .select(returnColumns)
        .andWhere({ is_active: true });
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
    const insert = db('following').insert({
      user_id() {
        this.select('id').from('users').where('handle', userhandle);
      },
      follower_id() {
        this.select('id').from('users').where('handle', followerhandle);
      },
    }).where({ is_active: false });
    const upsert = db.raw(`
      ? ON CONFLICT(user_id, follower_id)
          DO UPDATE SET
            is_active = true;
    `, [insert]);

    return baseModel.safeInsert(upsert);
  }

  async function removeFollower(dataObject) {
    const { userhandle, followerhandle } = dataObject;
    if (!userhandle || !followerhandle) {
      throw new ClientError({ message: 'User and follwer handles are required.' });
    }
    return db('following').update({ is_active: false }).where({
      user_id() {
        this.select('id').from('users').where('handle', userhandle);
      },
      follower_id() {
        this.select('id').from('users').where('handle', followerhandle);
      },
    });
  }

  async function isFollowing(user, follower) {
    const res = await db('following')
      .join('users as u', 'following.user_id', 'u.id')
      .join('users as follower', 'following.follower_id', 'follower.id')
      .where({ 'u.handle': user })
      .andWhere({ 'follower.handle': follower })
      .andWhere({ is_active: true })
      .limit(1);
    return Boolean(res.length);
  }

  return {
    getAll,
    get,
    create,
    update,
    getFollower,
    addFollower,
    removeFollower,
    getFollowing,
    isFollowing,
  };
}

export default makeUser;
