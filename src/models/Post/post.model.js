function makePost(db, baseModel) {
  const DEFAULT_GET_COLUMNS = [
    'posts.id as post_id', 'posts.image_uid', 'posts.caption', 'users.handle', 'users.avatar',
  ];

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
    const query = db('posts').first(returnColumns).join('users', 'posts.user_id', 'users.id');

    return baseModel.safeQuery(query, queryObject);
  }

  async function create(dataObject, options = {}) {
    const returnColumns = options.columns || ['posts.id', 'caption', 'image_uid'];
    const res = await baseModel.safeInsert(db('posts'), dataObject);

    if (process.env.NODE_ENV === 'test') {
      // workaround sqlite3 driver does not return fields for inserted row
      return this.get({ id: res[0] }, { columns: returnColumns });
    }

    return Promise.resolve(res);
  }

  async function likePost(dataObject, options = {}) {
    const insert = db('likes').insert(dataObject);
    const upsert = db.raw(`
    ? ON CONFLICT(user_id, post_id)
        DO UPDATE SET
          is_active = true;
    `, [insert]);
    return baseModel.safeInsert(upsert);
  }

  async function unlikePost(dataObject) {
    const insert = db('likes').update({ is_active: false }).where(dataObject);
    return baseModel.safeInsert(insert);
  }

  async function getLikes(dataObject, options = {}) {
    const countQueryAsC = db('likes')
      .select('post_id').count('post_id as like_count').where({ is_active: true })
      .groupBy('post_id')
      .as('c');

    const aggregrateQuery = db('likes')
      .select('c.like_count', 'likes.post_id', 'users.handle')
      .where({ is_active: true })
      .join('users', 'likes.user_id', 'users.id')
      .join(countQueryAsC, 'c.post_id', 'likes.post_id');

    if (Array.isArray(dataObject)) {
      return baseModel.safeQuery(aggregrateQuery.whereIn('likes.post_id', dataObject));
    }
    if (typeof dataObject === 'string' || typeof dataObject === 'number') {
      return baseModel.safeQuery(aggregrateQuery.where('likes.post_id', dataObject));
    }
    return baseModel.safeQuery(aggregrateQuery.where(dataObject));
  }

  async function getLikeCount(dataObject) {
    const countQuery = db('likes')
      .select('post_id').count('post_id as like_count').where({ is_active: true })
      .groupBy('post_id')
      .as('c');

    if (Array.isArray(dataObject)) {
      return baseModel.safeQuery(countQuery.whereIn('likes.post_id', dataObject));
    }
    if (typeof dataObject === 'string') {
      return baseModel.safeQuery(countQuery.where('likes.post_id', dataObject));
    }
    return baseModel.safeQuery(countQuery.where(dataObject));
  }

  async function getLikedPosts(userId) {
    const query = db('posts')
      .select('posts.id', 'image_uid', 'caption')
      .join('likes', 'likes.post_id', 'posts.id')
      .limit(10);
    return baseModel.safeQuery(query, { 'likes.user_id': userId });
  }

  // async function getLikedPosts(userId, postIds) {
  //   return db('posts').select('posts.id').count('likes.user_id')
  //     .leftJoin('likes', 'posts.id', 'likes.post_id')
  //     .where({ user_id: userId })
  //     .andWhereIn('likes.post_id', postIds)
  //     .groupBy('posts.id');
  // }

  // select
  //   c.like_count,
  //   likes.post_id,
  //   users.handle
  // from likes
  // join users on user_id = users.id
  // join (
  //   select
  //     post_id, count(*) as like_count
  //   from likes
  //   group by post_id) as c on c.post_id = likes.post_id;

  return {
    getAll,
    get,
    create,
    likePost,
    unlikePost,
    getLikes,
    getLikeCount,
    getLikedPosts,
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
