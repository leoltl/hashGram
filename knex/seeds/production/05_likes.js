
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('likes').del()
    .then(() => (
      // Inserts seed entries
      knex('likes').insert([
        {
          user_id: 1,
          post_id: 4,
        },
        {
          user_id: 1,
          post_id: 5,
        },
        {
          user_id: 1,
          post_id: 6,
        },
        {
          user_id: 1,
          post_id: 7,
        },
        {
          user_id: 1,
          post_id: 8,
        },
        {
          user_id: 1,
          post_id: 9,
        },
        {
          user_id: 1,
          post_id: 10,
        },
        {
          user_id: 1,
          post_id: 11,
        },
        {
          user_id: 1,
          post_id: 12,
        },
        {
          user_id: 1,
          post_id: 13,
        },
        {
          user_id: 1,
          post_id: 14,
        },
        {
          user_id: 1,
          post_id: 15,
        },
        {
          user_id: 1,
          post_id: 16,
        },
        {
          user_id: 1,
          post_id: 17,
        },
        {
          user_id: 1,
          post_id: 18,
        },
        {
          user_id: 1,
          post_id: 19,
        },
        {
          user_id: 1,
          post_id: 20,
        },

        {
          user_id: 2,
          post_id: 1,
        },
        {
          user_id: 2,
          post_id: 2,
        },
        {
          user_id: 2,
          post_id: 3,
        },
        {
          user_id: 2,
          post_id: 6,
        },
        {
          user_id: 2,
          post_id: 7,
        },
        {
          user_id: 2,
          post_id: 8,
        },
        {
          user_id: 2,
          post_id: 9,
        },
        {
          user_id: 2,
          post_id: 10,
        },
        {
          user_id: 2,
          post_id: 11,
        },
        {
          user_id: 2,
          post_id: 12,
        },
        {
          user_id: 2,
          post_id: 13,
        },
        {
          user_id: 2,
          post_id: 14,
        },
        {
          user_id: 2,
          post_id: 15,
        },
        {
          user_id: 2,
          post_id: 16,
        },
        {
          user_id: 2,
          post_id: 17,
        },
        {
          user_id: 2,
          post_id: 18,
        },
        {
          user_id: 2,
          post_id: 19,
        },
        {
          user_id: 2,
          post_id: 20,
        },


        {
          user_id: 3,
          post_id: 1,
        },
        {
          user_id: 3,
          post_id: 2,
        },
        {
          user_id: 3,
          post_id: 3,
        },
        {
          user_id: 3,
          post_id: 4,
        },
        {
          user_id: 3,
          post_id: 5,
        },
        {
          user_id: 3,
          post_id: 8,
        },
        {
          user_id: 3,
          post_id: 9,
        },
        {
          user_id: 3,
          post_id: 10,
        },
        {
          user_id: 3,
          post_id: 11,
        },
        {
          user_id: 3,
          post_id: 12,
        },
        {
          user_id: 3,
          post_id: 13,
        },
        {
          user_id: 3,
          post_id: 14,
        },
        {
          user_id: 3,
          post_id: 15,
        },
        {
          user_id: 3,
          post_id: 16,
        },
        {
          user_id: 3,
          post_id: 17,
        },
        {
          user_id: 3,
          post_id: 18,
        },
        {
          user_id: 3,
          post_id: 19,
        },
        {
          user_id: 3,
          post_id: 20,
        },
      ])
    ));
};
