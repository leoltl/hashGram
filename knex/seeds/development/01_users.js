
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex.raw('TRUNCATE TABLE likes RESTART IDENTITY CASCADE')
    .then(() => knex.raw('TRUNCATE TABLE comments RESTART IDENTITY CASCADE'))
    .then(() => knex.raw('TRUNCATE TABLE following RESTART IDENTITY CASCADE'))
    .then(() => knex.raw('TRUNCATE TABLE posts RESTART IDENTITY CASCADE'))
    .then(() => knex.raw('TRUNCATE TABLE users RESTART IDENTITY CASCADE'))
    .then(() => (
      // Inserts seed entries
      knex('users').insert([
        {
          id: 1,
          email: 'nigel@email.com',
          password: '$2b$10$Jay7jkbMTB/K3D9xzFM7NemDCGKQEx5GmKPybwU1zDABIGxQ/ye02',
          full_name: 'nigel L',
          handle: 'nigelL',
        },
        {
          id: 2,
          email: 'nakaz@email.com',
          password: '$2b$10$Jay7jkbMTB/K3D9xzFM7NemDCGKQEx5GmKPybwU1zDABIGxQ/ye02',
          full_name: 'nakaz L',
          handle: 'nakazL',
        },
        {
          id: 3,
          email: 'jaywon@email.com',
          password: '$2b$10$Jay7jkbMTB/K3D9xzFM7NemDCGKQEx5GmKPybwU1zDABIGxQ/ye02',
          full_name: 'jaywon L',
          handle: 'jaywonL',
        },
      ])
    ));
};
