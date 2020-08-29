const path = require('path');
// Update with your config settings.

module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      host:     'localhost',
      user:     'hashgram',
      password: 'hashgram',
      database: 'hashgram',
    },
    migrations: {
      directory: path.join(__dirname, '/knex/mmigrations'),
    },
    seeds: {
      directory: path.join(__dirname, '/knex/seeds'),
    },
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

};