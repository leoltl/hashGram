
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('following').del()
    .then(() => (
      // Inserts seed entries
      knex('following').insert([
        {
          user_id: 1,
          follower_id: 2,
          is_active: true,
        },
        {
          user_id: 2,
          follower_id: 1,
          is_active: true,
        },
        {
          user_id: 3,
          follower_id: 2,
          is_active: false,
        },
      ])
    ));
};
