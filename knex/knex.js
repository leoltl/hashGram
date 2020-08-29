import knex from 'knex';
import knewConfig from '../knexfile';

const environment = process.env.NODE_ENV || 'development';
const config = knewConfig[environment];

export default knex(config);
