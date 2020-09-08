
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('following').del()
    .then(() => (
      // Inserts seed entries
      knex('following').insert([
        {
          user_id: 2,
          follower_id: 1,
        },
        {
          user_id: 3,
          follower_id: 1,
        },
        {
          user_id: 4,
          follower_id: 1,
        },
        {
          user_id: 5,
          follower_id: 1,
        },
        {
          user_id: 6,
          follower_id: 1,
        },
        {
          user_id: 7,
          follower_id: 1,
        },
        {
          user_id: 8,
          follower_id: 1,
        },
        {
          user_id: 1,
          follower_id: 2,
        },
        {
          user_id: 3,
          follower_id: 2,
        },
        {
          user_id: 4,
          follower_id: 2,
        },
        {
          user_id: 5,
          follower_id: 2,
        },
        {
          user_id: 6,
          follower_id: 2,
        },
        {
          user_id: 7,
          follower_id: 2,
        },
        {
          user_id: 8,
          follower_id: 2,
        },
        {
          user_id: 1,
          follower_id: 3,
        },
        {
          user_id: 2,
          follower_id: 3,
        },
        {
          user_id: 4,
          follower_id: 3,
        },
        {
          user_id: 5,
          follower_id: 3,
        },
        {
          user_id: 6,
          follower_id: 3,
        },
        {
          user_id: 7,
          follower_id: 3,
        },
        {
          user_id: 8,
          follower_id: 3,
        },
      ])
    ));
};
