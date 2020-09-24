
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('messages').del()
    .then(() => (
      // Inserts seed entries
      knex('messages').insert([
        {
          id: 'c4d83c5a-719f-461d-b355-a9fffa6a251e',
          chat_id: 'a6160ddd-43b4-47dc-82c4-4487ec4d6f62',
          from_user: 'guest1',
          to_user: 'guest2',
          body: 'hello',
        },
        {
          chat_id: 'a6160ddd-43b4-47dc-82c4-4487ec4d6f62',
          from_user: 'guest2',
          to_user: 'guest1',
          body: 'hey bud',
        },
      ])
    ));
};
