
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('chat_user').del()
    .then(() => (
      // Inserts seed entries
      knex('chat_user').insert([
        {
          chat_id: 'a6160ddd-43b4-47dc-82c4-4487ec4d6f62',
          user_handle: 'guest1',
        },
        {
          chat_id: 'a6160ddd-43b4-47dc-82c4-4487ec4d6f62',
          user_handle: 'guest2',
        },
      ])
    ));
};
