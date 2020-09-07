
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('likes').del()
    .then(() => (
      // Inserts seed entries
      knex('likes').insert([
        {
          user_id: 1,
          post_id: 1,
        },
        {
          user_id: 2,
          post_id: 1,
        },
        {
          user_id: 3,
          post_id: 1,
        },
        {
          user_id: 1,
          post_id: 2,
        },
        {
          user_id: 1,
          post_id: 3,
        },
        {
          user_id: 1,
          post_id: 4,
        },
        {
          user_id: 1,
          post_id: 5,
        },
      ])
    ));
};
