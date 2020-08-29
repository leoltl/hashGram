
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').truncate()
    .then(() => (
      // Inserts seed entries
      knex('users').insert([
        {
          id: 1,
          email: 'nigel@email.com',
          password: 'dorwssap',
        },
        {
          id: 2,
          email: 'nakaz@email.com',
          password: 'password1',
        },
        {
          id: 3,
          email: 'jaywon@email.com',
          password: 'password123',
        },
      ])
    ));
};