
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
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
