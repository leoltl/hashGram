/* eslint-disable key-spacing */
const path = require('path');
// Update with your config settings.

module.exports = {

  test: {
    client: 'sqlite3',
    connection: {
      filename: ':memory:',
    },
    migrations: {
      directory: path.join(__dirname, '/knex/mmigrations'),
    },
    seeds: {
      directory: path.join(__dirname, '/knex/seeds/test'),
    },
    useNullAsDefault: true,
    log: {
      warn(message) {
        if (!message.includes('FS-related option specified for migration configuration')
          && !message.includes('.returning() is not supported by sqlite3')) {
          console.warn(message);
        }
      },
    },
  },

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
      directory: path.join(__dirname, '/knex/seeds/development'),
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
