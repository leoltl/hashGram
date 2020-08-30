
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
          first_name: 'nigel',
          last_name: 'L',
          handle: 'nigelL',
        },
        {
          id: 2,
          email: 'nakaz@email.com',
          password: 'password1',
          first_name: 'nakaz',
          last_name: 'L',
          handle: 'nakazL',
        },
        {
          id: 3,
          email: 'jaywon@email.com',
          password: 'password123',
          first_name: 'jaywon',
          last_name: 'L',
          handle: 'jaywonL',
        },
      ])
    ));
};
