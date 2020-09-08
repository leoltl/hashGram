exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('comments').del()
    .then(() => knex('comments').insert([
      { user_id: 1, post_id: 1, body: 'Nice picture' },
      { user_id: 6, post_id: 2, body: 'Where is this?' },
      { user_id: 4, post_id: 1, body: 'This is great @hashgram' },
      { user_id: 2, post_id: 4, body: 'Let\'s visit there! @leannaG' },
      { user_id: 8, post_id: 6, body: 'That\'s where we are heading next trip @nigelL' },
      { user_id: 2, post_id: 17, body: 'Nice picture' },
      { user_id: 3, post_id: 11, body: 'Where is this?' },
      { user_id: 5, post_id: 12, body: 'This is great @hashgram' },
      { user_id: 1, post_id: 1, body: 'Let\'s visit there! @leannaG' },
      { user_id: 6, post_id: 2, body: 'That\'s where we are heading next trip @nigelL' },
      { user_id: 3, post_id: 6, body: 'Nice picture' },
      { user_id: 5, post_id: 9, body: 'Where is this?' },
      { user_id: 8, post_id: 10, body: 'This is great @hashgram' },
      { user_id: 7, post_id: 20, body: 'Let\'s visit there! @leannaG' },
      { user_id: 1, post_id: 3, body: 'That\'s where we are heading next trip @nigelL' },
      { user_id: 1, post_id: 15, body: 'Let\'s visit there! @leannaG' },
      { user_id: 6, post_id: 15, body: 'That\'s where we are heading next trip @nigelL' },
      { user_id: 3, post_id: 3, body: 'Nice picture' },
      { user_id: 5, post_id: 4, body: 'Where is this?' },
      { user_id: 8, post_id: 5, body: 'This is great @hashgram' },
      { user_id: 7, post_id: 7, body: 'Let\'s visit there! @leannaG' },
      { user_id: 1, post_id: 9, body: 'That\'s where we are heading next trip @nigelL' },
    ]));
};
