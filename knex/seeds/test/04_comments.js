exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('comments').del()
    .then(() =>
      // Inserts seed entries
      knex('comments').insert([
        { user_id: 1, post_id: 1, body: 'i like comments' },
        { user_id: 2, post_id: 1, body: 'i like comments' },
        { user_id: 3, post_id: 1, body: 'i like comments' },
      ]));
};
