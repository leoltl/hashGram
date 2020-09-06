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

  async function getFeed(authUserId = null) {
    const queryForPosts = db('posts AS p')
      .select(
        'p.id AS post_id',
        'p.image_url AS imageUrl',
        'p.caption',
        'p.created_at',
        'u1.handle AS handle',
      )
      .join('users AS u1', 'p.user_id', 'u1.id')
      .orderBy('p.created_at', 'desc')
      .limit(10);

    if (authUserId) {
      // select post that auth user follows
      queryForPosts.where('p.user_id', 'in',
        db('users as u')
          .select('u.id')
          .join('following as f', 'u.id', 'f.user_id')
          .where({ 'f.follower_id': authUserId })
          .andWhere({ 'f.is_active': true }));
    }

    const posts = await queryForPosts;
    if (posts.length === 0) return [];

    const resultMap = new Map(); // use map to preserve posts order
    posts.forEach((post) => resultMap.set(post.post_id, post));

    const comments = await db('comments AS c')
      .select('c.body', 'c.created_at', 'u.handle', 'c.post_id')
      .join('users AS u', 'c.user_id', 'u.id')
      .whereIn('post_id', Array.from(resultMap.keys()));

    comments.forEach((comment) => {
      const post = resultMap.get(comment.post_id);
      post.comments = post.comments || [];
      post.comments.push(comment);
    });

    return Array.from(resultMap, (v) => v[1]);
  }

  return {
    getAll,
    get,
    create,
    getFeed,
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
