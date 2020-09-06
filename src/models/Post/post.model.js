function makePost(db, baseModel) {
  const DEFAULT_GET_COLUMNS = ['posts.id as post_id', 'posts.image_url', 'posts.caption', 'users.handle', 'users.full_name'];

  function getAll(queryObject = {}, options = {}) {
    const returnColumns = options.columns || DEFAULT_GET_COLUMNS;
    const query = db('posts')
      .select(returnColumns)
      .join('users', 'posts.user_id', 'users.id')
      .orderBy('posts.created_at', 'desc')
      .limit(10);

    if (queryObject.authUserId) {
      return baseModel.safeQuery(
        query.where('posts.user_id', 'in',
          db('users as u')
            .select('u.id')
            .join('following as f', 'u.id', 'f.user_id')
            .where({ 'f.follower_id': queryObject.authUserId })
            .andWhere({ 'f.is_active': true })),
      );
    }

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

/* potentially more efficient query for getFeed if all posts has at least one comment */
// async function getFeed() {
//   const query = `
//   SELECT
//     p.id AS post_id,
//     p.caption,
//     p.image_url,
//     u1.handle AS poster_handle,
//     u2.handle AS commenter_handle,
//     c1.id AS comment_id,
//     c1.body,
//     c1.created_at,
//     p.created_at AS post_created
//   FROM comments c1
//   JOIN posts AS p
//     ON c1.post_id = p.id
//   JOIN users AS u1
//     ON p.user_id = u1.id
//   JOIN users AS u2
//     ON c1.user_id = u2.id
//   WHERE c1.id IN (
//     SELECT c2.id
//     FROM comments AS c2
//     WHERE c1.post_id = c2.post_id
//     ORDER BY created_at desc
//     LIMIT 3
//   )
//   ORDER BY p.created_at, c1.created_at DESC;
//   `;
//   const res = await db.raw(query);
//   return Promise.resolve(res.rows);
// }
