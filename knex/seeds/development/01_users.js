
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(() => (
      // Inserts seed entries
      knex('users').insert([
        {
          id: 1,
          email: 'nigel@email.com',
          password: 'dorwssap',
          full_name: 'nigel L',
          handle: 'nigelL',
        },
        {
          id: 2,
          email: 'nakaz@email.com',
          password: 'password1',
          full_name: 'nakaz L',
          handle: 'nakazL',
        },
        {
          id: 3,
          email: 'jaywon@email.com',
          password: 'password123',
          full_name: 'jaywon L',
          handle: 'jaywonL',
        },
      ])
    ));
};
