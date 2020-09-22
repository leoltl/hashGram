
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
          email: 'guest1@email.com',
          password: '$2b$10$Jay7jkbMTB/K3D9xzFM7NemDCGKQEx5GmKPybwU1zDABIGxQ/ye02',
          full_name: 'Guest One',
          handle: 'guest1',
          avatar: 'a4cbebb64217a13bbbc8b4c8cfcf4fc1',
          active: true,
        },
        {
          email: 'guest2@email.com',
          password: '$2b$10$Jay7jkbMTB/K3D9xzFM7NemDCGKQEx5GmKPybwU1zDABIGxQ/ye02',
          full_name: 'Guest Two',
          handle: 'guest2',
          avatar: '413d8d3f4daa7974a236839cf67a3913',
          active: true,
        },
        {
          email: 'guest3@email.com',
          password: '$2b$10$Jay7jkbMTB/K3D9xzFM7NemDCGKQEx5GmKPybwU1zDABIGxQ/ye02',
          full_name: 'Guest Three',
          handle: 'guest3',
          avatar: '04c870aa4598be7af04c9cedaf860a64',
          active: true,
        },
        {
          email: 'nigel@email.com',
          password: '$2b$10$Jay7jkbMTB/K3D9xzFM7NemDCGKQEx5GmKPybwU1zDABIGxQ/ye02',
          full_name: 'nigel L',
          handle: 'nigelL',
          avatar: 'a4cbebb64217a13bbbc8b4c8cfcf4fc1',
          active: true,
        },
        {
          email: 'nakaz@email.com',
          password: '$2b$10$Jay7jkbMTB/K3D9xzFM7NemDCGKQEx5GmKPybwU1zDABIGxQ/ye02',
          full_name: 'nakaz L',
          handle: 'nakazL',
          avatar: '413d8d3f4daa7974a236839cf67a3913',
          active: true,
        },
        {
          email: 'jaywon@email.com',
          password: '$2b$10$Jay7jkbMTB/K3D9xzFM7NemDCGKQEx5GmKPybwU1zDABIGxQ/ye02',
          full_name: 'jaywon L',
          handle: 'jaywonL',
          avatar: '04c870aa4598be7af04c9cedaf860a64',
          active: true,
        },
        {
          email: 'leanneg@email.com',
          password: '$2b$10$Jay7jkbMTB/K3D9xzFM7NemDCGKQEx5GmKPybwU1zDABIGxQ/ye02',
          full_name: 'Leanne Graham',
          handle: 'LeanneG',
          avatar: 'a4cbebb64217a13bbbc8b4c8cfcf4fc1',
          active: true,
        },
        {
          email: 'ervinh@email.com',
          password: '$2b$10$Jay7jkbMTB/K3D9xzFM7NemDCGKQEx5GmKPybwU1zDABIGxQ/ye02',
          full_name: 'Ervin Howell',
          handle: 'ErvinH',
          avatar: '413d8d3f4daa7974a236839cf67a3913',
          active: true,
        },
      ])
    ));
};
