
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
          avatar: 'a4cbebb64217a13bbbc8b4c8cfcf4fc1',
        },
        {
          id: 2,
          email: 'nakaz@email.com',
          password: '$2b$10$Jay7jkbMTB/K3D9xzFM7NemDCGKQEx5GmKPybwU1zDABIGxQ/ye02',
          full_name: 'nakaz L',
          handle: 'nakazL',
          avatar: '413d8d3f4daa7974a236839cf67a3913',
        },
        {
          id: 3,
          email: 'jaywon@email.com',
          password: '$2b$10$Jay7jkbMTB/K3D9xzFM7NemDCGKQEx5GmKPybwU1zDABIGxQ/ye02',
          full_name: 'jaywon L',
          handle: 'jaywonL',
          avatar: '04c870aa4598be7af04c9cedaf860a64',
        },
      ])
    ));
};
